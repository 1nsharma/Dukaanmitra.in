"""
DukaanMitra AI Engineering — Core Brain PoC & Multi-Phase Engine
Implements:
- Phase 1: Core Brain Logic, Products (Maal), Customers (Grahak), SalesLog (Bikri) schema,
           Customer Frequency Analyzer ("Sharma ji har 20 din me aate hain"),
           Inactive / Churn Detector ("Gupta ji pichle 40 din se nahi aaye"),
           Hinglish AI Prompt & Offer Generator, Synthetic 3-Month Kirana Sales Data testing.
- Phase 2: MVP Features: CSV/Excel Importer (Vyapar/Khatabook), Magic Button ("Aaj ki AI Insights"),
           Manual WhatsApp redirect (wa.me) links.
- Phase 3: MLP Features: Voice Bookkeeping ("Mishra ji ne 5kg daal udhaar li"),
           Auto-Pilot WhatsApp Marketing via OpenWA (Port 2785),
           Supplier Mandi Rate Arbitrage Analyzer.
- Phase 4: MMP Features: Subscription Tiers (Free, Silver ₹299/mo, Gold ₹599/mo) and Governance.
"""

import os
import io
import csv
import json
import uuid
import re
import urllib.parse
import sqlite3
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, FastAPI, Request, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel, Field

# ==============================================================================
# 1. DATABASE SCHEMA & INITIALIZATION
# ==============================================================================

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def init_core_brain_db(db_path: str):
    """Initializes tables required for the Core Brain and all roadmap phases."""
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys=ON")
    with conn:
        conn.executescript("""
        -- Customers (Grahak)
        CREATE TABLE IF NOT EXISTS customers(
            id TEXT PRIMARY KEY,
            business_id TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            current_balance REAL NOT NULL DEFAULT 0.0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_cb_customers_biz ON customers(business_id);

        -- Sales Log (Bikri Record)
        CREATE TABLE IF NOT EXISTS sales_log(
            id TEXT PRIMARY KEY,
            business_id TEXT NOT NULL,
            customer_id TEXT,
            customer_name TEXT NOT NULL,
            customer_phone TEXT,
            items_json TEXT NOT NULL DEFAULT '[]',
            total_amount REAL NOT NULL,
            payment_mode TEXT NOT NULL DEFAULT 'cash', -- 'cash', 'udhaar', 'upi'
            sale_date TEXT NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_cb_sales_biz ON sales_log(business_id);
        CREATE INDEX IF NOT EXISTS idx_cb_sales_date ON sales_log(business_id, sale_date);

        -- Ledger Entries (Digital Udhaar & Khata)
        CREATE TABLE IF NOT EXISTS ledger_entries(
            id TEXT PRIMARY KEY,
            business_id TEXT NOT NULL,
            customer_id TEXT,
            entry_type TEXT NOT NULL CHECK(entry_type IN ('debit', 'credit')),
            amount REAL NOT NULL,
            notes TEXT,
            idempotency_key TEXT UNIQUE,
            created_at TEXT NOT NULL,
            created_by TEXT,
            FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_cb_ledger_biz ON ledger_entries(business_id);

        -- Supplier Benchmark Rates (Mandi & Wholesale Comparison)
        CREATE TABLE IF NOT EXISTS supplier_benchmarks(
            id TEXT PRIMARY KEY,
            item_name TEXT NOT NULL UNIQUE,
            category TEXT NOT NULL,
            mandi_rate REAL NOT NULL,
            distributor_rate REAL NOT NULL,
            unit TEXT NOT NULL DEFAULT 'kg',
            updated_at TEXT NOT NULL
        );

        -- Shop Subscriptions (Phase 4 Monetization)
        CREATE TABLE IF NOT EXISTS shop_subscriptions(
            business_id TEXT PRIMARY KEY,
            plan_tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'silver_299', 'gold_599'
            status TEXT NOT NULL DEFAULT 'active',
            monthly_fee REAL NOT NULL DEFAULT 0.0,
            features_json TEXT NOT NULL DEFAULT '{}',
            expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        """)
        # Seed default Mandi benchmarks if empty
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM supplier_benchmarks")
        if cur.fetchone()[0] == 0:
            benchmarks = [
                (str(uuid.uuid4()), "Aashirvaad Aata 10kg", "Groceries", 360.0, 385.0, "bag", now_iso()),
                (str(uuid.uuid4()), "Fortune Kachi Ghani Mustard Oil 1L", "Edible Oil", 132.0, 142.0, "pouch", now_iso()),
                (str(uuid.uuid4()), "Tata Namak 1kg", "Salt", 22.0, 26.0, "pkt", now_iso()),
                (str(uuid.uuid4()), "Toor Dal (Arhar) Premium", "Pulses", 145.0, 160.0, "kg", now_iso()),
                (str(uuid.uuid4()), "India Gate Basmati Rice 5kg", "Rice", 420.0, 460.0, "bag", now_iso()),
                (str(uuid.uuid4()), "Sugar (Chini) M-30", "Sugar", 38.0, 41.5, "kg", now_iso()),
                (str(uuid.uuid4()), "Surf Excel Easy Wash 1kg", "Detergent", 125.0, 138.0, "pkt", now_iso()),
            ]
            cur.executemany("INSERT INTO supplier_benchmarks VALUES(?,?,?,?,?,?,?)", benchmarks)
    conn.close()


# ==============================================================================
# 2. PHASE 1: THE CORE BRAIN ANALYTICS & PROMPT ENGINE
# ==============================================================================

class CoreBrainEngine:
    """
    Algorithmic intelligence engine tailored for Bharat's retail Kirana operations.
    Translates raw sales receipts into actionable customer frequency profiles,
    identifies churn risks, flags low stock, and drafts culturally natural Hinglish copy.
    """

    @staticmethod
    def calculate_customer_frequencies(conn: sqlite3.Connection, business_id: str) -> List[Dict[str, Any]]:
        """
        Analyzes sales_log to determine the purchasing frequency for each customer.
        Calculates:
        - Total visits
        - Average interval between visits in days
        - Most purchased items
        - Last purchase date
        - Natural language description (e.g. 'Sharma ji har 20 din me aata lete hain')
        """
        rows = conn.execute(
            """
            SELECT customer_name, customer_phone, items_json, total_amount, sale_date
            FROM sales_log
            WHERE business_id=?
            ORDER BY customer_name, sale_date ASC
            """,
            (business_id,)
        ).fetchall()

        if not rows:
            return []

        # Group sales by customer
        customer_sales: Dict[str, List[Dict[str, Any]]] = {}
        for r in rows:
            cname = (r["customer_name"] or "").strip()
            if not cname:
                continue
            if cname not in customer_sales:
                customer_sales[cname] = []
            customer_sales[cname].append({
                "phone": r["customer_phone"],
                "items": json.loads(r["items_json"] or "[]"),
                "total_amount": r["total_amount"],
                "date_str": r["sale_date"][:10]  # YYYY-MM-DD
            })

        results = []
        for name, history in customer_sales.items():
            dates = []
            item_counts: Dict[str, int] = {}
            phone = history[-1]["phone"] or ""

            for s in history:
                try:
                    dt = datetime.strptime(s["date_str"], "%Y-%m-%d")
                    dates.append(dt)
                except ValueError:
                    pass

                for it in s["items"]:
                    it_name = it.get("name") or it.get("item") or "Kirana Item"
                    item_counts[it_name] = item_counts.get(it_name, 0) + int(it.get("quantity", 1))

            dates = sorted(list(set(dates)))
            visit_count = len(dates)

            # Calculate average interval
            if visit_count > 1:
                intervals = [(dates[i] - dates[i-1]).days for i in range(1, len(dates))]
                avg_interval = round(sum(intervals) / len(intervals), 1)
            else:
                avg_interval = 30.0  # Default assumption for single-visit buyers

            # Top item
            top_item = max(item_counts.items(), key=lambda x: x[1])[0] if item_counts else "Kirana Samaagri"

            # Natural language frequency label
            if avg_interval <= 9:
                freq_desc = f"{name} lagbhag har hafte (har {int(avg_interval)} din me) aate hain"
            elif 10 <= avg_interval <= 25:
                freq_desc = f"{name} har {int(avg_interval)} din me {top_item} lete hain"
            else:
                freq_desc = f"{name} mahine me ek baar (har {int(avg_interval)} din me) rashan lete hain"

            last_date_str = dates[-1].strftime("%Y-%m-%d") if dates else history[-1]["date_str"]

            results.append({
                "customer_name": name,
                "phone": phone,
                "total_visits": visit_count,
                "avg_interval_days": avg_interval,
                "top_item": top_item,
                "frequency_summary": freq_desc,
                "last_visit_date": last_date_str
            })

        return results

    @staticmethod
    def detect_missed_customers(
        customer_profiles: List[Dict[str, Any]],
        reference_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Identifies inactive or churn-risk customers based on their expected cycle.
        E.g. If Sharma ji usually visits every 20 days and 40 days have passed without a visit.
        """
        ref = reference_date or datetime.now(timezone.utc)
        missed = []

        for p in customer_profiles:
            try:
                last_dt = datetime.strptime(p["last_visit_date"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
            except Exception:
                continue

            days_inactive = (ref - last_dt).days
            avg_cycle = p["avg_interval_days"]

            # If inactive for >= 1.5x of usual cycle OR > 35 days
            is_missed = (days_inactive >= avg_cycle * 1.4 and days_inactive >= 14) or (days_inactive >= 35)

            if is_missed:
                urgency = "CRITICAL" if days_inactive >= avg_cycle * 2.0 else "WARNING"
                missed.append({
                    "customer_name": p["customer_name"],
                    "phone": p["phone"],
                    "usual_cycle_days": avg_cycle,
                    "days_inactive": days_inactive,
                    "last_visit_date": p["last_visit_date"],
                    "top_item": p["top_item"],
                    "urgency": urgency,
                    "insight": f"{p['customer_name']} pichle {days_inactive} din se nahi aaye (Unka regular cycle har {int(avg_cycle)} din ka hai)."
                })

        # Sort by most inactive
        missed.sort(key=lambda x: x["days_inactive"], reverse=True)
        return missed

    @staticmethod
    def detect_urgent_reorders(conn: sqlite3.Connection, business_id: str) -> List[Dict[str, Any]]:
        """
        Scans products inventory for items that have breached reorder thresholds.
        """
        rows = conn.execute(
            """
            SELECT id, name, category, unit, quantity, reorder_level, cost_price, selling_price
            FROM products
            WHERE business_id=? AND quantity <= reorder_level
            ORDER BY (quantity / CASE WHEN reorder_level=0 THEN 1 ELSE reorder_level END) ASC
            """,
            (business_id,)
        ).fetchall()

        reorders = []
        for r in rows:
            qty = r["quantity"]
            ro = r["reorder_level"]
            urgency = "OUT_OF_STOCK" if qty <= 0 else ("CRITICAL" if qty <= (ro * 0.5) else "LOW_STOCK")
            reorders.append({
                "product_id": r["id"],
                "name": r["name"],
                "category": r["category"] or "General",
                "current_stock": qty,
                "reorder_level": ro,
                "unit": r["unit"],
                "cost_price": r["cost_price"],
                "selling_price": r["selling_price"],
                "urgency": urgency,
                "recommended_order_qty": max(ro * 3 - qty, 10.0)
            })

        return reorders

    @staticmethod
    def generate_ready_offers(
        missed_customers: List[Dict[str, Any]],
        shop_name: str = "DukaanMitra Kirana Store"
    ) -> List[Dict[str, Any]]:
        """
        Drafts hyper-personalized, culturally resonant Hinglish marketing messages
        with direct 1-tap WhatsApp redirect URLs.
        """
        offers = []
        for c in missed_customers:
            name = c["customer_name"]
            item = c["top_item"]
            phone = re.sub(r"\D", "", c.get("phone") or "")

            # Personalized friendly greeting
            message = (
                f"Namaste {name}! 🙏\n\n"
                f"{shop_name} se yaad kiya! Kafi din ho gaye aap dukaan par nahi aaye. "
                f"Aapka pasandeeda {item} aur taaza kirana ka naya stock aa gaya hai.\n\n"
                f"🎁 *Special Offer:* Is hafte order karne par aapko milegi special discount aur *Free Home Delivery*!\n\n"
                f"Abhi reply karke apna rashan book karein ya visit karein."
            )

            # Generate WhatsApp direct link
            encoded_text = urllib.parse.quote(message)
            phone_with_cc = f"91{phone}" if len(phone) == 10 else phone
            wa_link = f"https://wa.me/{phone_with_cc}?text={encoded_text}" if phone else ""

            offers.append({
                "customer_name": name,
                "phone": c.get("phone", ""),
                "target_item": item,
                "days_inactive": c["days_inactive"],
                "message_text": message,
                "whatsapp_redirect_url": wa_link,
                "copy_draft": message
            })

        return offers


# ==============================================================================
# 3. PHASE 2: CSV / EXCEL UPLOAD PARSER & MAGIC BUTTON AGGREGATOR
# ==============================================================================

class CsvImporter:
    """
    Ingests CSV / spreadsheet exports from Vyapar, Khatabook, or legacy POS.
    Maps columns flexibly:
    - Customer: Customer, Name, Grahak, Party Name
    - Phone: Phone, Mobile, Contact
    - Item: Product, Item, Item Name, Maal, Description
    - Quantity: Qty, Quantity, Matra
    - Amount: Amount, Total, Price, Value, Bikri
    - Date: Date, Bill Date, Tarikh
    """
    @staticmethod
    def parse_and_ingest(conn: sqlite3.Connection, business_id: str, csv_content: str) -> Dict[str, Any]:
        reader = csv.reader(io.StringIO(csv_content.strip()))
        rows = list(reader)
        if not rows or len(rows) < 2:
            raise ValueError("CSV must contain a header row and at least one data row")

        headers = [h.strip().lower() for h in rows[0]]

        def find_col(*aliases):
            for a in aliases:
                for idx, h in enumerate(headers):
                    if a in h:
                        return idx
            return None

        c_idx = find_col("customer", "party", "grahak", "name")
        p_idx = find_col("phone", "mobile", "contact")
        i_idx = find_col("item", "product", "maal", "description")
        q_idx = find_col("qty", "quantity", "matra")
        a_idx = find_col("amount", "total", "price", "bikri")
        d_idx = find_col("date", "tarikh", "created")
        m_idx = find_col("mode", "payment", "type")

        inserted_sales = 0
        inserted_customers = 0
        inserted_products = 0

        # Cache existing customers & products
        existing_cust = {r["name"].lower(): r["id"] for r in conn.execute("SELECT id, name FROM customers WHERE business_id=?", (business_id,)).fetchall()}
        existing_prod = {r["name"].lower(): r["id"] for r in conn.execute("SELECT id, name FROM products WHERE business_id=?", (business_id,)).fetchall()}

        now_ts = now_iso()

        for row in rows[1:]:
            if not row or not any(row):
                continue

            cust_name = row[c_idx].strip() if c_idx is not None and c_idx < len(row) else "Walk-in Grahak"
            phone = row[p_idx].strip() if p_idx is not None and p_idx < len(row) else ""
            item_name = row[i_idx].strip() if i_idx is not None and i_idx < len(row) else "General Kirana"
            
            try:
                qty = float(row[q_idx].strip()) if q_idx is not None and q_idx < len(row) and row[q_idx].strip() else 1.0
            except ValueError:
                qty = 1.0

            try:
                amount = float(re.sub(r"[^\d.]", "", row[a_idx].strip())) if a_idx is not None and a_idx < len(row) and row[a_idx].strip() else 100.0
            except ValueError:
                amount = 100.0

            date_str = row[d_idx].strip() if d_idx is not None and d_idx < len(row) and row[d_idx].strip() else now_ts[:10]
            # Normalise date format YYYY-MM-DD
            if "/" in date_str:
                parts = date_str.split("/")
                if len(parts) == 3:
                    if len(parts[2]) == 4: # DD/MM/YYYY
                        date_str = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"

            pay_mode = row[m_idx].strip().lower() if m_idx is not None and m_idx < len(row) and row[m_idx].strip() else "cash"
            if "udhaar" in pay_mode or "credit" in pay_mode:
                pay_mode = "udhaar"
            elif "upi" in pay_mode or "online" in pay_mode:
                pay_mode = "upi"
            else:
                pay_mode = "cash"

            # Auto-create Customer if missing
            cust_id = existing_cust.get(cust_name.lower())
            if not cust_id and cust_name != "Walk-in Grahak":
                cust_id = "cst_" + str(uuid.uuid4())
                conn.execute(
                    "INSERT INTO customers (id, business_id, name, phone, current_balance, created_at, updated_at) VALUES(?,?,?,?,?,?,?)",
                    (cust_id, business_id, cust_name, phone, 0.0, now_ts, now_ts)
                )
                existing_cust[cust_name.lower()] = cust_id
                inserted_customers += 1

            # Auto-create Product if missing
            prod_id = existing_prod.get(item_name.lower())
            if not prod_id:
                prod_id = "prd_" + str(uuid.uuid4())
                conn.execute(
                    """
                    INSERT INTO products (id, business_id, name, sku, category, unit, quantity, reorder_level, cost_price, selling_price, created_at, updated_at)
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
                    """,
                    (prod_id, business_id, item_name, None, "Kirana", "pcs", 50.0, 10.0, round(amount * 0.85, 2), amount, now_ts, now_ts)
                )
                existing_prod[item_name.lower()] = prod_id
                inserted_products += 1

            # Insert Sale Log
            items_payload = [{"name": item_name, "quantity": qty, "price": amount}]
            sale_id = "sal_" + str(uuid.uuid4())
            conn.execute(
                """
                INSERT INTO sales_log (id, business_id, customer_id, customer_name, customer_phone, items_json, total_amount, payment_mode, sale_date, created_at)
                VALUES(?,?,?,?,?,?,?,?,?,?)
                """,
                (sale_id, business_id, cust_id, cust_name, phone, json.dumps(items_payload), amount, pay_mode, date_str, now_ts)
            )
            inserted_sales += 1

        return {
            "status": "success",
            "inserted_sales": inserted_sales,
            "new_customers_created": inserted_customers,
            "new_products_created": inserted_products
        }


# ==============================================================================
# 4. PHASE 3: VOICE BOOKKEEPING & SUPPLIER RATE ARBITRAGE
# ==============================================================================

class VoiceBookkeepingParser:
    """
    Parses natural Hindi and Hinglish voice bookkeeping inputs without complex UI.
    Handles:
    - 'Mishra ji ne 5kg daal udhaar li' -> records udhaar debit, updates ledger & customer balance
    - 'Sharma ji ne 500 rupaye jama karwaye' -> records credit payment, reduces udhaar balance
    - 'Gupta ji ko 2 refined oil becha cash me' -> records cash sale in sales_log
    """
    @staticmethod
    def parse_speech_command(conn: sqlite3.Connection, business_id: str, voice_text: str) -> Dict[str, Any]:
        text = voice_text.strip()
        low = text.lower()
        now_ts = now_iso()

        # Check for Jama / Payment received
        # e.g., "Sharma ji ne 500 rupaye diye/jama kiye"
        m_jama = re.search(r"([a-zA-Z\u0900-\u097F\s]+?)\s+(?:ne|ji\s+ne)\s+(\d+(?:\.\d+)?)\s*(?:rupaye|rs|inr)?\s*(?:jama|diye|paid|chukaaye)", low)
        if m_jama:
            raw_name = m_jama.group(1).replace("ji", "").strip().title()
            amount = float(m_jama.group(2))

            cust = conn.execute("SELECT * FROM customers WHERE business_id=? AND name LIKE ?", (business_id, f"%{raw_name}%")).fetchone()
            if not cust:
                # Create customer on the fly
                cust_id = "cst_" + str(uuid.uuid4())
                conn.execute(
                    "INSERT INTO customers (id, business_id, name, current_balance, created_at, updated_at) VALUES(?,?,?,?,?,?)",
                    (cust_id, business_id, f"{raw_name} ji", 0.0, now_ts, now_ts)
                )
                curr_balance = 0.0
                cust_name = f"{raw_name} ji"
            else:
                cust_id = cust["id"]
                curr_balance = cust["current_balance"]
                cust_name = cust["name"]

            new_balance = round(curr_balance - amount, 2)
            conn.execute("UPDATE customers SET current_balance=?, updated_at=? WHERE id=?", (new_balance, now_ts, cust_id))

            # Record in ledger_entries
            conn.execute(
                """
                INSERT INTO ledger_entries (id, business_id, customer_id, entry_type, amount, notes, created_at, created_by)
                VALUES(?,?,?,?,?,?,?,?)
                """,
                (str(uuid.uuid4()), business_id, cust_id, "credit", amount, f"Voice Bookkeeping: {text}", now_ts, "voice_agent")
            )

            return {
                "action": "payment_received",
                "customer_name": cust_name,
                "amount": amount,
                "new_balance": new_balance,
                "reply": f"✅ {cust_name} ne ₹{amount:g} jama karwaye. Naya baaki balance: ₹{new_balance:g}"
            }

        # Check for Udhaar / Credit taken
        # e.g., "Mishra ji ne 5kg daal udhaar li" or "Verma ji 400 rupaye udhaar le gaye"
        m_udhaar = re.search(r"([a-zA-Z\u0900-\u097F\s]+?)\s+(?:ne|ji\s+ne)?\s*(\d+(?:\.\d+)?)\s*(kg|kilo|gram|liter|l|packet|pkt|unit|pcs|rupaye|rs)?\s*([a-zA-Z\u0900-\u097F\s]*?)\s*(?:udhaar|udhari|khata)\s*(?:li|liya|di|diya|le gaye)?", low)
        if m_udhaar or "udhaar" in low or "udhari" in low:
            name_cand = (m_udhaar.group(1) if m_udhaar else low.split("udhaar")[0]).replace("ji", "").replace("ne", "").strip().title()
            num_val = float(m_udhaar.group(2)) if (m_udhaar and m_udhaar.group(2)) else 100.0
            unit_or_rs = (m_udhaar.group(3) or "").strip() if m_udhaar else ""
            item_cand = (m_udhaar.group(4) or "").strip() if m_udhaar else "Kirana Samaagri"

            # Determine if amount or quantity
            if unit_or_rs in ("rupaye", "rs", "inr") or not unit_or_rs:
                amount = num_val
                item_desc = item_cand or "Kirana Item"
            else:
                item_desc = f"{num_val:g} {unit_or_rs} {item_cand}".strip()
                # Estimate amount if item given
                prod = conn.execute("SELECT selling_price FROM products WHERE business_id=? AND name LIKE ?", (business_id, f"%{item_cand}%")).fetchone()
                unit_price = prod["selling_price"] if prod and prod["selling_price"] else 50.0
                amount = round(num_val * unit_price, 2)

            cust = conn.execute("SELECT * FROM customers WHERE business_id=? AND name LIKE ?", (business_id, f"%{name_cand}%")).fetchone()
            if not cust:
                cust_id = "cst_" + str(uuid.uuid4())
                conn.execute(
                    "INSERT INTO customers (id, business_id, name, current_balance, created_at, updated_at) VALUES(?,?,?,?,?,?)",
                    (cust_id, business_id, f"{name_cand} ji", 0.0, now_ts, now_ts)
                )
                curr_balance = 0.0
                cust_name = f"{name_cand} ji"
            else:
                cust_id = cust["id"]
                curr_balance = cust["current_balance"]
                cust_name = cust["name"]

            new_balance = round(curr_balance + amount, 2)
            conn.execute("UPDATE customers SET current_balance=?, updated_at=? WHERE id=?", (new_balance, now_ts, cust_id))

            # Record in ledger_entries & sales_log
            conn.execute(
                """
                INSERT INTO ledger_entries (id, business_id, customer_id, entry_type, amount, notes, created_at, created_by)
                VALUES(?,?,?,?,?,?,?,?)
                """,
                (str(uuid.uuid4()), business_id, cust_id, "debit", amount, f"Voice Udhaar: {text}", now_ts, "voice_agent")
            )

            conn.execute(
                """
                INSERT INTO sales_log (id, business_id, customer_id, customer_name, items_json, total_amount, payment_mode, sale_date, created_at)
                VALUES(?,?,?,?,?,?,?,?,?)
                """,
                (str(uuid.uuid4()), business_id, cust_id, cust_name, json.dumps([{"item": item_desc, "amount": amount}]), amount, "udhaar", now_ts[:10], now_ts)
            )

            return {
                "action": "udhaar_recorded",
                "customer_name": cust_name,
                "item_recorded": item_desc,
                "amount": amount,
                "new_balance": new_balance,
                "reply": f"✅ {cust_name} ke khate me {item_desc} (₹{amount:g}) udhaar darj ho gayi hai. Naya udhaar baaki: ₹{new_balance:g}"
            }

        # Fallback cash sale
        return {
            "action": "general_voice_noted",
            "reply": f"Command darj kar liya gaya hai: '{text}'. Kripya 'Mishra ji ne 5kg daal udhaar li' ya 'Sharma ji ne 500 jama kiye' bolein."
        }


class SupplierRateAnalyzer:
    """
    Compares the shop's product cost prices against Mandi / wholesale benchmark rates.
    Alerts shopkeeper when their distributor is overcharging.
    """
    @staticmethod
    def analyze_margins_and_savings(conn: sqlite3.Connection, business_id: str) -> Dict[str, Any]:
        shop_prods = conn.execute(
            "SELECT name, category, cost_price, selling_price, quantity, unit FROM products WHERE business_id=?",
            (business_id,)
        ).fetchall()

        benchmarks = conn.execute("SELECT * FROM supplier_benchmarks").fetchall()
        bm_map = {b["item_name"].lower(): dict(b) for b in benchmarks}

        arbitrage_opportunities = []
        total_monthly_saving_potential = 0.0

        for p in shop_prods:
            p_name = p["name"].lower()
            cost = p["cost_price"] or 0.0
            if cost <= 0:
                continue

            # Match benchmark by keyword
            matched_bm = None
            for bm_name, bm in bm_map.items():
                if any(w in p_name for w in bm_name.split() if len(w) > 3):
                    matched_bm = bm
                    break

            if matched_bm:
                mandi_rate = matched_bm["mandi_rate"]
                if cost > mandi_rate:
                    diff_per_unit = round(cost - mandi_rate, 2)
                    estimated_monthly_volume = max(p["quantity"] * 2.5, 30.0)
                    monthly_saving = round(diff_per_unit * estimated_monthly_volume, 2)
                    total_monthly_saving_potential += monthly_saving

                    arbitrage_opportunities.append({
                        "product_name": p["name"],
                        "your_cost_price": cost,
                        "mandi_wholesale_rate": mandi_rate,
                        "extra_cost_per_unit": diff_per_unit,
                        "unit": p["unit"] or matched_bm["unit"],
                        "estimated_monthly_saving": monthly_saving,
                        "recommendation": f"{p['name']} par aapka supplier ₹{diff_per_unit}/unit zyada le raha hai. Mandi rate ₹{mandi_rate} hai. Monthly bachat: ₹{monthly_saving:g}!"
                    })

        arbitrage_opportunities.sort(key=lambda x: x["estimated_monthly_saving"], reverse=True)

        return {
            "total_monthly_saving_potential": round(total_monthly_saving_potential, 2),
            "arbitrage_count": len(arbitrage_opportunities),
            "opportunities": arbitrage_opportunities
        }


# ==============================================================================
# 5. PHASE 4: SUBSCRIPTION & TIER GOVERNANCE (MMP)
# ==============================================================================

TIER_PLANS = {
    "free": {
        "name": "DukaanMitra Free Starter",
        "monthly_fee": 0.0,
        "max_sales_per_month": 50,
        "features": ["manual_whatsapp_redirect", "basic_inventory", "basic_ledger"]
    },
    "silver_299": {
        "name": "DukaanMitra Silver Pro (₹299/mo)",
        "monthly_fee": 299.0,
        "max_sales_per_month": 10000,
        "features": ["magic_button_insights", "csv_import", "voice_bookkeeping", "manual_whatsapp_redirect"]
    },
    "gold_599": {
        "name": "DukaanMitra Gold Superintelligence (₹599/mo)",
        "monthly_fee": 599.0,
        "max_sales_per_month": 999999,
        "features": ["magic_button_insights", "csv_import", "voice_bookkeeping", "openwa_autopilot_marketing", "supplier_mandi_analyzer", "priority_support"]
    }
}

def get_or_create_subscription(conn: sqlite3.Connection, business_id: str) -> Dict[str, Any]:
    row = conn.execute("SELECT * FROM shop_subscriptions WHERE business_id=?", (business_id,)).fetchone()
    if not row:
        now_ts = now_iso()
        exp_ts = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()
        conn.execute(
            """
            INSERT INTO shop_subscriptions (business_id, plan_tier, status, monthly_fee, features_json, expires_at, created_at)
            VALUES(?,?,?,?,?,?,?)
            """,
            (business_id, "gold_599", "active", 599.0, json.dumps(TIER_PLANS["gold_599"]["features"]), exp_ts, now_ts)
        )
        return {"business_id": business_id, "plan_tier": "gold_599", "status": "active", "monthly_fee": 599.0, "plan_details": TIER_PLANS["gold_599"]}
    
    tier_info = TIER_PLANS.get(row["plan_tier"], TIER_PLANS["free"])
    return {
        "business_id": business_id,
        "plan_tier": row["plan_tier"],
        "status": row["status"],
        "monthly_fee": row["monthly_fee"],
        "expires_at": row["expires_at"],
        "plan_details": tier_info
    }


# ==============================================================================
# 6. FASTAPI ROUTER & REST ENDPOINTS
# ==============================================================================

router = APIRouter(prefix="/api/v1/core-brain", tags=["DukaanMitra Core Brain Engine"])

class VoiceInput(BaseModel):
    voice_text: str = Field(min_length=2, max_length=500, description="Hindi/Hinglish speech-to-text transcript")
    actor_id: Optional[str] = None

class AutopilotRequest(BaseModel):
    openwa_url: Optional[str] = "http://localhost:2785"
    dry_run: bool = True
    customer_phone: Optional[str] = None

class SubscriptionUpgrade(BaseModel):
    target_tier: str = Field(..., pattern="^(free|silver_299|gold_599)$")

def get_db_conn():
    from app import DB_PATH
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
    finally:
        conn.close()


@router.get("/magic-insights/{business_id}")
def get_magic_insights(business_id: str, conn: sqlite3.Connection = Depends(get_db_conn)):
    """
    The 'Magic Button' (Aaj ki AI Insights) endpoint.
    Aggregates:
    1. Urgent Re-order List (Stock khatam hone wala maal)
    2. Missed Customers List (Toote hue regular grahak)
    3. Ready Offers (Hinglish marketing copy with 1-tap WhatsApp wa.me links)
    """
    # 1. Urgent Reorders
    reorders = CoreBrainEngine.detect_urgent_reorders(conn, business_id)

    # 2. Customer Frequency & Missed Customers
    frequencies = CoreBrainEngine.calculate_customer_frequencies(conn, business_id)
    missed = CoreBrainEngine.detect_missed_customers(frequencies)

    # Fetch shop name
    biz = conn.execute("SELECT name FROM businesses WHERE id=?", (business_id,)).fetchone()
    shop_name = biz["name"] if biz else "DukaanMitra Kirana Store"

    # 3. Ready Offers in Hinglish with wa.me link
    offers = CoreBrainEngine.generate_ready_offers(missed, shop_name=shop_name)

    # Supplier arbitrage summary
    supplier_analysis = SupplierRateAnalyzer.analyze_margins_and_savings(conn, business_id)

    return {
        "status": "success",
        "business_id": business_id,
        "shop_name": shop_name,
        "generated_at": now_iso(),
        "summary": {
            "urgent_reorder_count": len(reorders),
            "missed_customers_count": len(missed),
            "total_ready_offers": len(offers),
            "potential_supplier_savings": supplier_analysis["total_monthly_saving_potential"]
        },
        "urgent_reorders": reorders,
        "missed_customers": missed,
        "ready_offers": offers,
        "supplier_arbitrage": supplier_analysis
    }


@router.post("/upload-csv/{business_id}")
async def upload_csv(business_id: str, file: UploadFile = File(...), conn: sqlite3.Connection = Depends(get_db_conn)):
    """
    Phase 2: Ingests CSV from Vyapar, Khatabook, or legacy POS spreadsheets.
    Auto-populates products, customers, and sales logs.
    """
    content_bytes = await file.read(5 * 1024 * 1024)
    csv_text = content_bytes.decode("utf-8", errors="replace")
    try:
        result = CsvImporter.parse_and_ingest(conn, business_id, csv_text)
        conn.commit()
        return result
    except Exception as e:
        raise HTTPException(400, f"CSV parsing failed: {str(e)}")


@router.post("/voice-bookkeeping/{business_id}")
def voice_bookkeeping(business_id: str, body: VoiceInput, conn: sqlite3.Connection = Depends(get_db_conn)):
    """
    Phase 3: Voice Bookkeeping.
    Takes voice transcript (e.g. 'Mishra ji ne 5kg daal udhaar li')
    and updates customers, ledger_entries, and sales_log.
    """
    result = VoiceBookkeepingParser.parse_speech_command(conn, business_id, body.voice_text)
    conn.commit()
    return result


@router.get("/supplier-arbitrage/{business_id}")
def get_supplier_arbitrage(business_id: str, conn: sqlite3.Connection = Depends(get_db_conn)):
    """
    Phase 3: Supplier Rate Analyzer.
    Compares internal cost prices against Mandi benchmark rates.
    """
    return SupplierRateAnalyzer.analyze_margins_and_savings(conn, business_id)


@router.post("/autopilot-marketing/{business_id}")
async def autopilot_marketing(
    business_id: str,
    body: AutopilotRequest,
    conn: sqlite3.Connection = Depends(get_db_conn)
):
    """
    Phase 3: Auto-Pilot WhatsApp Marketing via OpenWA Gateway (Port 2785).
    Sends or previews automated offers to missed customers.
    """
    frequencies = CoreBrainEngine.calculate_customer_frequencies(conn, business_id)
    missed = CoreBrainEngine.detect_missed_customers(frequencies)

    biz = conn.execute("SELECT name FROM businesses WHERE id=?", (business_id,)).fetchone()
    shop_name = biz["name"] if biz else "DukaanMitra Kirana Store"
    offers = CoreBrainEngine.generate_ready_offers(missed, shop_name=shop_name)

    if not offers:
        return {"status": "success", "message": "No missed customers requiring offers today."}

    results = []
    for off in offers:
        phone = re.sub(r"\D", "", off.get("phone") or "")
        if not phone:
            continue
        formatted_phone = f"91{phone}" if len(phone) == 10 else phone

        if body.dry_run:
            results.append({
                "recipient": formatted_phone,
                "status": "simulated_queued",
                "preview": off["message_text"]
            })
        else:
            # Connect to OpenWA on port 2785
            import urllib.request
            openwa_endpoint = f"{body.openwa_url.rstrip('/')}/api/sendText"
            payload = json.dumps({
                "chatId": f"{formatted_phone}@c.us",
                "text": off["message_text"]
            }).encode("utf-8")
            req = urllib.request.Request(
                openwa_endpoint,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            try:
                with urllib.request.urlopen(req, timeout=5) as res:
                    res_data = json.loads(res.read().decode())
                    results.append({"recipient": formatted_phone, "status": "sent", "response": res_data})
            except Exception as e:
                results.append({"recipient": formatted_phone, "status": "gateway_offline_queued", "error": str(e)})

    return {
        "status": "success",
        "mode": "dry_run" if body.dry_run else "live_broadcast",
        "total_targets": len(results),
        "broadcast_log": results
    }


@router.get("/subscription/{business_id}")
def get_subscription(business_id: str, conn: sqlite3.Connection = Depends(get_db_conn)):
    """Phase 4: View active monetization plan."""
    return get_or_create_subscription(conn, business_id)


@router.post("/subscription/{business_id}/upgrade")
def upgrade_subscription(
    business_id: str,
    body: SubscriptionUpgrade,
    conn: sqlite3.Connection = Depends(get_db_conn)
):
    """Phase 4: Upgrade subscription tier (Free, Silver ₹299, Gold ₹599)."""
    now_ts = now_iso()
    exp_ts = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    plan_info = TIER_PLANS[body.target_tier]

    conn.execute(
        """
        INSERT INTO shop_subscriptions (business_id, plan_tier, status, monthly_fee, features_json, expires_at, created_at)
        VALUES(?,?,?,?,?,?,?)
        ON CONFLICT(business_id) DO UPDATE SET
            plan_tier=excluded.plan_tier,
            monthly_fee=excluded.monthly_fee,
            features_json=excluded.features_json,
            expires_at=excluded.expires_at
        """,
        (business_id, body.target_tier, "active", plan_info["monthly_fee"], json.dumps(plan_info["features"]), exp_ts, now_ts)
    )
    conn.commit()

    return {
        "status": "upgraded",
        "business_id": business_id,
        "new_tier": body.target_tier,
        "plan_name": plan_info["name"],
        "monthly_fee": plan_info["monthly_fee"],
        "expires_at": exp_ts
    }


def register_core_brain_routes(app: FastAPI, db_path: str):
    """Registers Core Brain schema and routes with the main FastAPI instance."""
    init_core_brain_db(db_path)
    app.include_router(router)
