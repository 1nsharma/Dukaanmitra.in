"""
DukaanMitra Compliance Rules Engine
Versioned statutory rules, GST validation, and Indian Compliance Calendar.
Official References:
- GST Portal: gst.gov.in
- Income Tax Department: incometax.gov.in (Including Income-tax Act 2025 transition)
- Ministry of Corporate Affairs: mca.gov.in
"""
import re
from datetime import datetime
from typing import Dict, List, Any, Optional

GSTIN_REGEX = re.compile(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")

# Indian State Codes under GST
STATE_CODES = {
    "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab", "04": "Chandigarh",
    "05": "Uttarakhand", "06": "Haryana", "07": "Delhi", "08": "Rajasthan",
    "09": "Uttar Pradesh", "10": "Bihar", "19": "West Bengal", "24": "Gujarat",
    "27": "Maharashtra", "29": "Karnataka", "33": "Tamil Nadu", "36": "Telangana"
}

# Standard GST Tax Slabs (Goods & Services)
STANDARD_TAX_SLABS = [0.0, 5.0, 12.0, 18.0, 28.0]

def validate_gstin(gstin: str) -> Dict[str, Any]:
    if not gstin or not isinstance(gstin, str):
        return {"valid": False, "error": "GSTIN cannot be empty"}
    gstin = gstin.strip().upper()
    if not GSTIN_REGEX.match(gstin):
        return {"valid": False, "error": "Invalid GSTIN format (must be 15-character alphanumeric format: 22AAAAA0000A1Z5)"}
    state_code = gstin[:2]
    pan = gstin[2:12]
    if state_code not in STATE_CODES:
        return {"valid": False, "error": f"Unknown state code prefix '{state_code}' in GSTIN"}
    return {
        "valid": True,
        "gstin": gstin,
        "state_code": state_code,
        "state_name": STATE_CODES.get(state_code),
        "pan": pan,
    }

def calculate_gst_breakdown(
    supplier_state_code: str,
    recipient_state_code: str,
    taxable_value: float,
    rate_percent: float
) -> Dict[str, float]:
    """
    Intra-state (same state) -> CGST + SGST (half each)
    Inter-state (different states) -> IGST (full rate)
    All monetary values rounded to 2 decimal places.
    """
    taxable_value = round(float(taxable_value), 2)
    rate_percent = float(rate_percent)
    total_tax = round((taxable_value * rate_percent) / 100.0, 2)

    if supplier_state_code == recipient_state_code:
        half_tax = round(total_tax / 2.0, 2)
        other_half = round(total_tax - half_tax, 2)
        return {
            "taxable_value": taxable_value,
            "rate_percent": rate_percent,
            "is_interstate": False,
            "cgst_rate": rate_percent / 2.0,
            "cgst_amount": half_tax,
            "sgst_rate": rate_percent / 2.0,
            "sgst_amount": other_half,
            "igst_rate": 0.0,
            "igst_amount": 0.0,
            "total_tax": total_tax,
            "total_invoice_value": round(taxable_value + total_tax, 2)
        }
    else:
        return {
            "taxable_value": taxable_value,
            "rate_percent": rate_percent,
            "is_interstate": True,
            "cgst_rate": 0.0,
            "cgst_amount": 0.0,
            "sgst_rate": 0.0,
            "sgst_amount": 0.0,
            "igst_rate": rate_percent,
            "igst_amount": total_tax,
            "total_tax": total_tax,
            "total_invoice_value": round(taxable_value + total_tax, 2)
        }

def match_gstr2b(
    purchase_register: List[Dict[str, Any]],
    gstr2b_records: List[Dict[str, Any]],
    value_tolerance: float = 2.0
) -> Dict[str, Any]:
    """
    Matches Purchase Register entries against GSTR-2B ITC download.
    Classifications:
    1. MATCHED: Invoice number, supplier GSTIN and tax values match within tolerance.
    2. VALUE_MISMATCH: Supplier GSTIN and Invoice No match, but tax/invoice value differs.
    3. MISSING_IN_2B: Recorded in purchase book but supplier has not uploaded in GSTR-1 (ITC at risk).
    4. MISSING_IN_BOOKS: Appears in GSTR-2B but merchant has not entered bill in books.
    """
    gstr2b_map = {}
    for item in gstr2b_records:
        key = (item.get("supplier_gstin", "").strip().upper(), str(item.get("invoice_number", "")).strip().upper())
        gstr2b_map[key] = item

    matched = []
    value_mismatches = []
    missing_in_2b = []
    seen_2b_keys = set()

    for pr in purchase_register:
        s_gstin = pr.get("supplier_gstin", "").strip().upper()
        inv_no = str(pr.get("invoice_number", "")).strip().upper()
        key = (s_gstin, inv_no)

        if key in gstr2b_map:
            seen_2b_keys.add(key)
            g2b = gstr2b_map[key]
            pr_val = float(pr.get("taxable_value", 0.0))
            g2b_val = float(g2b.get("taxable_value", 0.0))
            pr_tax = float(pr.get("tax_amount", 0.0))
            g2b_tax = float(g2b.get("tax_amount", 0.0))

            diff_val = abs(pr_val - g2b_val)
            diff_tax = abs(pr_tax - g2b_tax)

            if diff_val <= value_tolerance and diff_tax <= value_tolerance:
                matched.append({
                    "supplier_gstin": s_gstin,
                    "invoice_number": inv_no,
                    "book_value": pr_val,
                    "gstr2b_value": g2b_val,
                    "itc_eligible": True,
                    "status": "MATCHED"
                })
            else:
                value_mismatches.append({
                    "supplier_gstin": s_gstin,
                    "invoice_number": inv_no,
                    "book_value": pr_val,
                    "gstr2b_value": g2b_val,
                    "value_difference": round(diff_val, 2),
                    "tax_difference": round(diff_tax, 2),
                    "status": "VALUE_MISMATCH",
                    "action_required": "Review supplier invoice or request correction"
                })
        else:
            missing_in_2b.append({
                "supplier_gstin": s_gstin,
                "invoice_number": inv_no,
                "book_value": pr.get("taxable_value", 0.0),
                "tax_amount": pr.get("tax_amount", 0.0),
                "status": "MISSING_IN_2B",
                "risk": "ITC cannot be claimed until supplier files GSTR-1"
            })

    missing_in_books = []
    for key, g2b in gstr2b_map.items():
        if key not in seen_2b_keys:
            missing_in_books.append({
                "supplier_gstin": key[0],
                "invoice_number": key[1],
                "gstr2b_value": g2b.get("taxable_value", 0.0),
                "tax_amount": g2b.get("tax_amount", 0.0),
                "status": "MISSING_IN_BOOKS",
                "action_required": "Confirm if purchase bill was received and record in books"
            })

    total_eligible_itc = sum(m.get("book_value", 0) for m in matched)
    itc_at_risk = sum(m.get("tax_amount", 0) for m in missing_in_2b)

    return {
        "summary": {
            "total_purchase_records": len(purchase_register),
            "matched_count": len(matched),
            "value_mismatch_count": len(value_mismatches),
            "missing_in_2b_count": len(missing_in_2b),
            "missing_in_books_count": len(missing_in_books),
            "itc_at_risk_amount": round(itc_at_risk, 2)
        },
        "matched": matched,
        "value_mismatches": value_mismatches,
        "missing_in_2b": missing_in_2b,
        "missing_in_books": missing_in_books
    }

def get_compliance_calendar(financial_year: str = "2026-27") -> List[Dict[str, Any]]:
    """
    Returns verified statutory compliance obligations and deadlines.
    Includes rules under GST Act and the Income-tax Act 2025 transition.
    """
    return [
        {
            "category": "GST",
            "obligation": "GSTR-1 (Monthly)",
            "description": "Outward supplies statement for taxpayers with turnover > Rs 5 Crore or non-QRMP",
            "due_day_of_month": 11,
            "statutory_reference": "Section 37 of CGST Act, 2017",
            "official_portal": "https://www.gst.gov.in"
        },
        {
            "category": "GST",
            "obligation": "GSTR-2B Auto-Drafted ITC Statement",
            "description": "Auto-generated static ITC statement available on 14th of following month",
            "due_day_of_month": 14,
            "statutory_reference": "Rule 60(7) of CGST Rules, 2017",
            "official_portal": "https://www.gst.gov.in"
        },
        {
            "category": "GST",
            "obligation": "GSTR-3B (Monthly Summary & Tax Payment)",
            "description": "Summary return and tax settlement for monthly filers",
            "due_day_of_month": 20,
            "statutory_reference": "Section 39 of CGST Act, 2017",
            "official_portal": "https://www.gst.gov.in"
        },
        {
            "category": "Direct Tax",
            "obligation": "TDS / TCS Monthly Deposit",
            "description": "Deposit of tax deducted/collected at source for previous month",
            "due_day_of_month": 7,
            "statutory_reference": "Rule 30 of Income-tax Rules",
            "official_portal": "https://www.incometax.gov.in"
        },
        {
            "category": "Direct Tax",
            "obligation": "Advance Tax Installments",
            "description": "Quarterly advance tax installments (15% by June 15, 45% by Sept 15, 75% by Dec 15, 100% by March 15)",
            "statutory_reference": "Section 211 of Income-tax Act / Income-tax Act 2025 transition",
            "official_portal": "https://www.incometax.gov.in"
        }
    ]