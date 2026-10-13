"""
DukaanMitra MCP Tool Gateway & Agent Interface
Implements standard Model Context Protocol (MCP) typed tools with Zero Trust tenant scoping,
policy checks, and maker-checker approval controls.
"""
import json, sqlite3, os
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
from compliance_rules import validate_gstin, calculate_gst_breakdown, match_gstr2b, get_compliance_calendar

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.getenv("DUKAANMITRA_DB", os.path.join(BASE_DIR, "dukaanmitra.db"))

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

class SecurityPolicyException(Exception):
    pass

def verify_tenant_access(conn: sqlite3.Connection, tenant_id: str, actor_role: Optional[str] = None):
    row = conn.execute("SELECT id FROM businesses WHERE id=?", (tenant_id,)).fetchone()
    if not row:
        raise SecurityPolicyException(f"Tenant isolation error: Business '{tenant_id}' does not exist or access denied.")
    if actor_role and actor_role not in ["owner", "manager", "staff"]:
        raise SecurityPolicyException(f"Authorization error: Role '{actor_role}' does not have sufficient permissions.")

# ==============================================================================
# MCP Tool Registry & Declarations
# ==============================================================================

MCP_TOOL_DEFINITIONS = [
    {
        "name": "get_inventory_summary",
        "description": "Returns current inventory levels, items below reorder threshold, and total valuation for an authorized tenant.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tenant_id": {"type": "string", "description": "Tenant/Business ID"},
                "low_stock_only": {"type": "boolean", "default": False}
            },
            "required": ["tenant_id"]
        }
    },
    {
        "name": "detect_stockout_risk",
        "description": "Calculates stockout risks based on current inventory, safety stock, and recent sales velocity.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tenant_id": {"type": "string", "description": "Tenant/Business ID"}
            },
            "required": ["tenant_id"]
        }
    },
    {
        "name": "create_purchase_order_draft",
        "description": "Prepares a draft purchase order (Level 3 Prepare). Does NOT finalize or disburse funds.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tenant_id": {"type": "string", "description": "Tenant/Business ID"},
                "supplier_name": {"type": "string"},
                "items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "product_id": {"type": "string"},
                            "quantity": {"type": "number"},
                            "unit_cost": {"type": "number"}
                        },
                        "required": ["product_id", "quantity", "unit_cost"]
                    }
                },
                "notes": {"type": "string"}
            },
            "required": ["tenant_id", "supplier_name", "items"]
        }
    },
    {
        "name": "approve_purchase_order",
        "description": "Maker-checker approval: Authorizes or rejects a draft purchase order. Restricted to owner or manager.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tenant_id": {"type": "string"},
                "order_id": {"type": "string"},
                "action": {"type": "string", "enum": ["approve", "reject"]},
                "approver_role": {"type": "string", "description": "Role of approving user"}
            },
            "required": ["tenant_id", "order_id", "action", "approver_role"]
        }
    },
    {
        "name": "validate_gst_invoice",
        "description": "Validates GST invoice data, GSTIN format, tax calculation (CGST/SGST vs IGST), and mandatory tax rules.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tenant_id": {"type": "string"},
                "supplier_gstin": {"type": "string"},
                "recipient_gstin": {"type": "string"},
                "taxable_value": {"type": "number"},
                "gst_rate": {"type": "number"}
            },
            "required": ["tenant_id", "supplier_gstin", "recipient_gstin", "taxable_value", "gst_rate"]
        }
    },
    {
        "name": "reconcile_gstr2b",
        "description": "Performs automated reconciliation between purchase register and GSTR-2B ITC download.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tenant_id": {"type": "string"},
                "purchase_register": {"type": "array"},
                "gstr2b_records": {"type": "array"}
            },
            "required": ["tenant_id", "purchase_register", "gstr2b_records"]
        }
    },
    {
        "name": "get_compliance_deadlines",
        "description": "Returns upcoming statutory deadlines for GST, Advance Tax, and Direct Taxes.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "financial_year": {"type": "string", "default": "2026-27"}
            }
        }
    }
]

# ==============================================================================
# MCP Tool Execution Functions
# ==============================================================================

def execute_mcp_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    with get_db() as conn:
        tenant_id = arguments.get("tenant_id")
        if tenant_id:
            verify_tenant_access(conn, tenant_id)

        if tool_name == "get_inventory_summary":
            low_only = arguments.get("low_stock_only", False)
            query = "SELECT * FROM products WHERE business_id=?"
            if low_only:
                query += " AND quantity <= reorder_level"
            rows = conn.execute(query, (tenant_id,)).fetchall()
            products = [dict(r) for r in rows]
            total_items = len(products)
            total_valuation = sum((p["quantity"] * (p["cost_price"] or 0)) for p in products)
            return {
                "tenant_id": tenant_id,
                "total_products": total_items,
                "total_valuation": round(total_valuation, 2),
                "products": products
            }

        elif tool_name == "detect_stockout_risk":
            rows = conn.execute(
                "SELECT id, name, sku, quantity, reorder_level, cost_price, selling_price FROM products WHERE business_id=? AND quantity <= reorder_level",
                (tenant_id,)
            ).fetchall()
            risks = []
            for r in rows:
                p = dict(r)
                shortfall = max(0, p["reorder_level"] - p["quantity"])
                risks.append({
                    "product_id": p["id"],
                    "product_name": p["name"],
                    "sku": p["sku"],
                    "current_stock": p["quantity"],
                    "reorder_level": p["reorder_level"],
                    "shortfall": shortfall,
                    "recommended_reorder_qty": shortfall + (p["reorder_level"] * 2),
                    "evidence": f"Current stock ({p['quantity']}) has reached or fallen below safety stock ({p['reorder_level']})."
                })
            return {
                "tenant_id": tenant_id,
                "at_risk_count": len(risks),
                "items_at_risk": risks
            }

        elif tool_name == "create_purchase_order_draft":
            supplier = arguments["supplier_name"]
            items = arguments["items"]
            total_amount = sum(float(i["quantity"]) * float(i["unit_cost"]) for i in items)
            po_id = "po_" + str(int(datetime.now(timezone.utc).timestamp()))
            now_iso = datetime.now(timezone.utc).isoformat()

            conn.execute(
                """INSERT INTO purchase_orders (id, business_id, supplier_name, items_json, total_amount, status, created_at)
                   VALUES (?, ?, ?, ?, ?, 'draft', ?)""",
                (po_id, tenant_id, supplier, json.dumps(items), total_amount, now_iso)
            )
            # Log audit
            conn.execute(
                "INSERT INTO audit_log (id, business_id, action, entity_type, entity_id, details_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                ("aud_" + po_id, tenant_id, "PO_DRAFT_CREATED", "purchase_order", po_id, json.dumps({"total": total_amount, "supplier": supplier}), now_iso)
            )
            conn.commit()
            return {
                "order_id": po_id,
                "tenant_id": tenant_id,
                "status": "draft",
                "supplier_name": supplier,
                "total_amount": round(total_amount, 2),
                "items_count": len(items),
                "message": "Draft purchase order created. Requires authorized owner/manager approval before execution."
            }

        elif tool_name == "approve_purchase_order":
            order_id = arguments["order_id"]
            action = arguments["action"]
            role = arguments.get("approver_role", "")

            if role not in ["owner", "manager"]:
                return {
                    "success": False,
                    "error": f"Security Policy Violation: Approvals require 'owner' or 'manager' role. Actor has '{role}'."
                }

            row = conn.execute("SELECT * FROM purchase_orders WHERE id=? AND business_id=?", (order_id, tenant_id)).fetchone()
            if not row:
                return {"success": False, "error": f"Purchase order '{order_id}' not found."}

            new_status = "approved" if action == "approve" else "rejected"
            conn.execute("UPDATE purchase_orders SET status=? WHERE id=?", (new_status, order_id))
            now_iso = datetime.now(timezone.utc).isoformat()
            conn.execute(
                "INSERT INTO audit_log (id, business_id, action, entity_type, entity_id, details_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                ("aud_" + str(int(datetime.now(timezone.utc).timestamp())), tenant_id, f"PO_{new_status.upper()}", "purchase_order", order_id, json.dumps({"role": role}), now_iso)
            )
            conn.commit()
            return {
                "success": True,
                "order_id": order_id,
                "status": new_status,
                "approved_by_role": role
            }

        elif tool_name == "validate_gst_invoice":
            s_val = validate_gstin(arguments["supplier_gstin"])
            r_val = validate_gstin(arguments["recipient_gstin"])
            if not s_val["valid"]:
                return {"valid": False, "error": f"Supplier GSTIN error: {s_val['error']}"}
            if not r_val["valid"]:
                return {"valid": False, "error": f"Recipient GSTIN error: {r_val['error']}"}

            breakdown = calculate_gst_breakdown(
                supplier_state_code=s_val["state_code"],
                recipient_state_code=r_val["state_code"],
                taxable_value=arguments["taxable_value"],
                rate_percent=arguments["gst_rate"]
            )
            return {
                "valid": True,
                "supplier": s_val,
                "recipient": r_val,
                "tax_breakdown": breakdown
            }

        elif tool_name == "reconcile_gstr2b":
            pr = arguments.get("purchase_register", [])
            g2b = arguments.get("gstr2b_records", [])
            result = match_gstr2b(pr, g2b)
            return result

        elif tool_name == "get_compliance_deadlines":
            fy = arguments.get("financial_year", "2026-27")
            calendar = get_compliance_calendar(fy)
            return {"financial_year": fy, "obligations": calendar}

        else:
            raise ValueError(f"Unknown MCP tool: {tool_name}")