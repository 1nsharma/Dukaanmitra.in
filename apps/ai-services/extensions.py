"""
DukaanMitra Phase 1 Vertical Slice Extensions:
- Atomic Sales & Inventory Ledger Transactions
- Transactional Outbox for Reliable Events
- Model Context Protocol (MCP) Tool Gateway
- Indian Compliance OS (GST Validation, GSTR-2B Matching, Calendar)
"""
import json, uuid, os, sqlite3
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import FastAPI, Request, HTTPException, Header
from pydantic import BaseModel, Field

from compliance_rules import validate_gstin, calculate_gst_breakdown, match_gstr2b, get_compliance_calendar
from mcp_server import execute_mcp_tool, MCP_TOOL_DEFINITIONS, SecurityPolicyException, get_db

def now():
    return datetime.now(timezone.utc).isoformat()

def init_extended_db(db_path: str):
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys=ON")
    with conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS sales(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, idempotency_key TEXT UNIQUE,
          customer_name TEXT, customer_phone TEXT, total_amount REAL NOT NULL,
          payment_mode TEXT NOT NULL DEFAULT 'cash', status TEXT NOT NULL DEFAULT 'completed',
          created_at TEXT NOT NULL, FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_sales_business ON sales(business_id);
        CREATE TABLE IF NOT EXISTS sale_items(
          id TEXT PRIMARY KEY, sale_id TEXT NOT NULL, product_id TEXT NOT NULL,
          quantity REAL NOT NULL, unit_price REAL NOT NULL, total_price REAL NOT NULL,
          FOREIGN KEY(sale_id) REFERENCES sales(id), FOREIGN KEY(product_id) REFERENCES products(id)
        );
        CREATE TABLE IF NOT EXISTS outbox_events(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, event_type TEXT NOT NULL,
          payload_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL, processed_at TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox_events(status);
        CREATE TABLE IF NOT EXISTS purchase_orders(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, supplier_name TEXT NOT NULL,
          items_json TEXT NOT NULL, total_amount REAL NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
          created_at TEXT NOT NULL, updated_at TEXT, FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE TABLE IF NOT EXISTS gst_invoices(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, invoice_number TEXT NOT NULL,
          supplier_gstin TEXT NOT NULL, recipient_gstin TEXT NOT NULL, taxable_value REAL NOT NULL,
          tax_rate REAL NOT NULL, cgst_amount REAL NOT NULL DEFAULT 0, sgst_amount REAL NOT NULL DEFAULT 0,
          igst_amount REAL NOT NULL DEFAULT 0, total_amount REAL NOT NULL, status TEXT NOT NULL DEFAULT 'recorded',
          created_at TEXT NOT NULL, FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        """)
    conn.close()

class SaleItemIn(BaseModel):
    product_id: str
    quantity: float = Field(gt=0)
    unit_price: Optional[float] = None

class SaleIn(BaseModel):
    items: List[SaleItemIn]
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    payment_mode: str = 'cash'
    actor_id: Optional[str] = None

class McpCallIn(BaseModel):
    tool: str
    arguments: dict

def record_sale(business_id: str, body: SaleIn, x_idempotency_key: Optional[str] = None, conn: Optional[sqlite3.Connection] = None):
    if not body.items:
        raise HTTPException(400, "Sale must include at least one item")
    
    close_at_end = False
    if conn is None:
        conn = get_db()
        close_at_end = True

    try:
        biz = conn.execute("SELECT * FROM businesses WHERE id=?", (business_id,)).fetchone()
        if not biz:
            raise HTTPException(404, "Business not found")

        if x_idempotency_key:
            existing = conn.execute("SELECT * FROM sales WHERE business_id=? AND idempotency_key=?", (business_id, x_idempotency_key)).fetchone()
            if existing:
                sale_id = existing["id"]
                items = conn.execute("SELECT * FROM sale_items WHERE sale_id=?", (sale_id,)).fetchall()
                return {
                    "idempotent_replay": True,
                    "sale": dict(existing),
                    "items": [dict(i) for i in items]
                }

        sale_id = "sal_" + str(uuid.uuid4())
        ts = now()
        total_sale_amount = 0.0
        processed_items = []

        for item in body.items:
            prod = conn.execute("SELECT * FROM products WHERE id=? AND business_id=?", (item.product_id, business_id)).fetchone()
            if not prod:
                raise HTTPException(404, f"Product '{item.product_id}' not found in business")
            if prod["quantity"] < item.quantity:
                raise HTTPException(400, f"Insufficient stock for '{prod['name']}'. Available: {prod['quantity']}, Requested: {item.quantity}")

            unit_price = item.unit_price if item.unit_price is not None else (prod["selling_price"] or 0.0)
            line_total = round(unit_price * item.quantity, 2)
            total_sale_amount += line_total

            new_stock = prod["quantity"] - item.quantity
            conn.execute("UPDATE products SET quantity=?, updated_at=? WHERE id=?", (new_stock, ts, item.product_id))

            conn.execute("INSERT INTO stock_movements VALUES(?,?,?,?,?,?,?)",
                (str(uuid.uuid4()), business_id, item.product_id, -item.quantity, f"sale:{sale_id}", body.actor_id, ts))

            processed_items.append({
                "id": str(uuid.uuid4()),
                "sale_id": sale_id,
                "product_id": item.product_id,
                "product_name": prod["name"],
                "quantity": item.quantity,
                "unit_price": unit_price,
                "total_price": line_total
            })

        conn.execute("INSERT INTO sales VALUES(?,?,?,?,?,?,?,?,?)",
            (sale_id, business_id, x_idempotency_key, body.customer_name, body.customer_phone, round(total_sale_amount, 2), body.payment_mode, "completed", ts))

        for pi in processed_items:
            conn.execute("INSERT INTO sale_items VALUES(?,?,?,?,?,?)",
                (pi["id"], sale_id, pi["product_id"], pi["quantity"], pi["unit_price"], pi["total_price"]))

        outbox_payload = {
            "sale_id": sale_id,
            "business_id": business_id,
            "total_amount": round(total_sale_amount, 2),
            "payment_mode": body.payment_mode,
            "items_count": len(processed_items),
            "timestamp": ts
        }
        outbox_id = "evt_" + str(uuid.uuid4())
        conn.execute("INSERT INTO outbox_events VALUES(?,?,?,?,?,?,?)",
            (outbox_id, business_id, "sale.completed", json.dumps(outbox_payload), "pending", ts, None))

        conn.execute("INSERT INTO audit_log VALUES(?,?,?,?,?,?,?,?)",
            (str(uuid.uuid4()), business_id, body.actor_id, "sale.completed", "sale", sale_id,
             json.dumps({"total_amount": round(total_sale_amount, 2), "items": len(processed_items)}, ensure_ascii=False), ts))

        conn.commit()

        return {
            "idempotent_replay": False,
            "sale_id": sale_id,
            "total_amount": round(total_sale_amount, 2),
            "payment_mode": body.payment_mode,
            "outbox_event_id": outbox_id,
            "items": processed_items
        }
    finally:
        if close_at_end:
            conn.close()

def register_extensions(app: FastAPI, db_getter, audit_func, get_biz_func, db_path: str):
    init_extended_db(db_path)

    @app.post("/api/businesses/{business_id}/sales")
    def api_record_sale(business_id: str, body: SaleIn, x_idempotency_key: Optional[str] = Header(default=None)):
        with db_getter() as c:
            return record_sale(business_id, body, x_idempotency_key=x_idempotency_key, conn=c)

    @app.get("/api/businesses/{business_id}/sales")
    def list_sales(business_id: str, limit: int = 50):
        with db_getter() as c:
            get_biz_func(c, business_id)
            rows = c.execute("SELECT * FROM sales WHERE business_id=? ORDER BY created_at DESC LIMIT ?", (business_id, limit)).fetchall()
            result = []
            for r in rows:
                items = c.execute("SELECT si.*, p.name as product_name FROM sale_items si JOIN products p ON si.product_id=p.id WHERE si.sale_id=?", (r["id"],)).fetchall()
                result.append({**dict(r), "items": [dict(i) for i in items]})
            return result

    @app.get("/api/businesses/{business_id}/outbox")
    def list_outbox_events(business_id: str, status: Optional[str] = None):
        with db_getter() as c:
            get_biz_func(c, business_id)
            q = "SELECT * FROM outbox_events WHERE business_id=?"
            params = [business_id]
            if status:
                q += " AND status=?"
                params.append(status)
            q += " ORDER BY created_at ASC"
            rows = c.execute(q, params).fetchall()
            return [{**dict(r), "payload": json.loads(r["payload_json"])} for r in rows]

    @app.post("/api/businesses/{business_id}/outbox/dispatch")
    def dispatch_outbox_events(business_id: str):
        with db_getter() as c:
            get_biz_func(c, business_id)
            rows = c.execute("SELECT * FROM outbox_events WHERE business_id=? AND status='pending' ORDER BY created_at ASC", (business_id,)).fetchall()
            dispatched = []
            ts = now()
            for r in rows:
                c.execute("UPDATE outbox_events SET status='processed', processed_at=? WHERE id=?", (ts, r["id"]))
                dispatched.append(r["id"])
            return {"dispatched_count": len(dispatched), "event_ids": dispatched}

    @app.get("/api/mcp/tools")
    def mcp_tools():
        return {"tools": MCP_TOOL_DEFINITIONS}

    @app.post("/api/mcp/call")
    def mcp_call(body: McpCallIn):
        try:
            result = execute_mcp_tool(body.tool, body.arguments)
            return {"success": True, "result": result}
        except SecurityPolicyException as spe:
            raise HTTPException(403, str(spe))
        except Exception as e:
            raise HTTPException(400, f"MCP execution error: {str(e)}")

    @app.post("/api/compliance/validate-invoice")
    def compliance_validate_invoice(body: dict):
        return execute_mcp_tool("validate_gst_invoice", body)

    @app.post("/api/compliance/reconcile-gstr2b")
    def compliance_reconcile_2b(body: dict):
        return execute_mcp_tool("reconcile_gstr2b", body)

    @app.get("/api/compliance/calendar")
    def compliance_calendar(financial_year: str = "2026-27"):
        return {"financial_year": financial_year, "obligations": get_compliance_calendar(financial_year)}
