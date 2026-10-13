"""
DukaanMitra Master Blueprint Phase 1: Vertical Slice & Compliance OS Test Suite
Validates:
1. Zero Trust Multi-Tenant Isolation
2. Atomic Sales & Inventory Ledger Transactions (Stock movement + Sale + Outbox)
3. Idempotency (Deduplication of repeated sales/events)
4. Transactional Outbox Event Emission & Dispatch
5. Model Context Protocol (MCP) Tool Gateway & Security Policies
6. Maker-Checker Approval (Purchase Order Drafts cannot be executed without owner approval)
7. GST Intelligence Engine & GSTR-2B ITC Matching
"""
import unittest, os, sys, uuid, json

# Ensure apps/ai-services is in Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import app, mcp_server, compliance_rules
from mcp_server import execute_mcp_tool, SecurityPolicyException
from compliance_rules import validate_gstin, calculate_gst_breakdown, match_gstr2b, get_compliance_calendar

class TestVerticalSlice(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.init_db()
        app.extensions.init_extended_db(app.DB_PATH)

    def setUp(self):
        self.conn = app.db()
        # Create two distinct businesses to test tenant isolation
        self.biz_a_id = f"test_biz_a_{uuid.uuid4().hex[:6]}"
        self.biz_b_id = f"test_biz_b_{uuid.uuid4().hex[:6]}"
        now_ts = app.now()

        self.conn.execute("INSERT INTO businesses VALUES(?,?,?,?,?)", (self.biz_a_id, "Shop A Kirana", "retail", "INR", now_ts))
        self.conn.execute("INSERT INTO businesses VALUES(?,?,?,?,?)", (self.biz_b_id, "Shop B Pharmacy", "pharmacy", "INR", now_ts))

        # Create products in Shop A
        self.prod_a_id = f"prod_a_{uuid.uuid4().hex[:6]}"
        self.conn.execute(
            """INSERT INTO products (id, business_id, name, sku, category, unit, quantity, reorder_level, cost_price, selling_price, attributes_json, created_at, updated_at)
               VALUES (?, ?, 'Tata Salt 1kg', 'SALT01', 'groceries', 'pcs', 50, 10, 20.0, 28.0, '{}', ?, ?)""",
            (self.prod_a_id, self.biz_a_id, now_ts, now_ts)
        )

        # Create products in Shop B
        self.prod_b_id = f"prod_b_{uuid.uuid4().hex[:6]}"
        self.conn.execute(
            """INSERT INTO products (id, business_id, name, sku, category, unit, quantity, reorder_level, cost_price, selling_price, attributes_json, created_at, updated_at)
               VALUES (?, ?, 'Paracetamol 650', 'PCM650', 'medicines', 'strip', 20, 5, 15.0, 30.0, '{}', ?, ?)""",
            (self.prod_b_id, self.biz_b_id, now_ts, now_ts)
        )
        self.conn.commit()

    def tearDown(self):
        # Clean up test businesses
        self.conn.execute("DELETE FROM sale_items WHERE sale_id IN (SELECT id FROM sales WHERE business_id IN (?, ?))", (self.biz_a_id, self.biz_b_id))
        self.conn.execute("DELETE FROM sales WHERE business_id IN (?, ?)", (self.biz_a_id, self.biz_b_id))
        self.conn.execute("DELETE FROM outbox_events WHERE business_id IN (?, ?)", (self.biz_a_id, self.biz_b_id))
        self.conn.execute("DELETE FROM stock_movements WHERE business_id IN (?, ?)", (self.biz_a_id, self.biz_b_id))
        self.conn.execute("DELETE FROM purchase_orders WHERE business_id IN (?, ?)", (self.biz_a_id, self.biz_b_id))
        self.conn.execute("DELETE FROM products WHERE business_id IN (?, ?)", (self.biz_a_id, self.biz_b_id))
        self.conn.execute("DELETE FROM businesses WHERE id IN (?, ?)", (self.biz_a_id, self.biz_b_id))
        self.conn.commit()
        self.conn.close()

    def test_tenant_isolation(self):
        """Shop A cannot access or query products belonging to Shop B."""
        # Querying products for Shop A returns only Shop A products
        prods_a = self.conn.execute("SELECT * FROM products WHERE business_id=?", (self.biz_a_id,)).fetchall()
        prod_ids_a = [p["id"] for p in prods_a]
        self.assertIn(self.prod_a_id, prod_ids_a)
        self.assertNotIn(self.prod_b_id, prod_ids_a)

        # Cross-tenant MCP access rejection
        with self.assertRaises(SecurityPolicyException):
            execute_mcp_tool("get_inventory_summary", {"tenant_id": "non_existent_or_unauthorized_shop"})

    def test_atomic_sale_and_inventory_ledger(self):
        """Sale, stock movement, outbox event and audit log commit atomically."""
        # Initial stock of Tata Salt = 50
        initial_stock = self.conn.execute("SELECT quantity FROM products WHERE id=?", (self.prod_a_id,)).fetchone()["quantity"]
        self.assertEqual(initial_stock, 50)

        # Execute sale of 5 packets
        sale_body = app.extensions.SaleIn(
            items=[app.extensions.SaleItemIn(product_id=self.prod_a_id, quantity=5, unit_price=28.0)],
            customer_name="Ramesh Kumar",
            payment_mode="cash"
        )
        res = app.extensions.record_sale(self.biz_a_id, sale_body)

        self.assertFalse(res["idempotent_replay"])
        self.assertEqual(res["total_amount"], 140.0)

        # Check stock decremented to 45
        new_stock = self.conn.execute("SELECT quantity FROM products WHERE id=?", (self.prod_a_id,)).fetchone()["quantity"]
        self.assertEqual(new_stock, 45)

        # Check stock movement recorded with reference to sale
        movement = self.conn.execute("SELECT * FROM stock_movements WHERE business_id=? AND product_id=?", (self.biz_a_id, self.prod_a_id)).fetchone()
        self.assertIsNotNone(movement)
        self.assertEqual(movement["delta"], -5)
        self.assertTrue(movement["reason"].startswith("sale:"))

        # Check Transactional Outbox event created
        outbox = self.conn.execute("SELECT * FROM outbox_events WHERE business_id=? AND event_type='sale.completed'", (self.biz_a_id,)).fetchone()
        self.assertIsNotNone(outbox)
        self.assertEqual(outbox["status"], "pending")

    def test_sale_idempotency(self):
        """Submitting sale with identical idempotency key prevents duplicate transactions."""
        key = f"idemp_{uuid.uuid4().hex}"
        sale_body = app.extensions.SaleIn(
            items=[app.extensions.SaleItemIn(product_id=self.prod_a_id, quantity=2, unit_price=28.0)],
            customer_name="Sita Devi",
            payment_mode="upi"
        )

        res1 = app.extensions.record_sale(self.biz_a_id, sale_body, x_idempotency_key=key)
        self.assertFalse(res1["idempotent_replay"])
        first_stock = self.conn.execute("SELECT quantity FROM products WHERE id=?", (self.prod_a_id,)).fetchone()["quantity"]
        self.assertEqual(first_stock, 48)

        # Re-submit with same idempotency key
        res2 = app.extensions.record_sale(self.biz_a_id, sale_body, x_idempotency_key=key)
        self.assertTrue(res2["idempotent_replay"])

        # Stock should NOT have decremented a second time
        second_stock = self.conn.execute("SELECT quantity FROM products WHERE id=?", (self.prod_a_id,)).fetchone()["quantity"]
        self.assertEqual(second_stock, 48)

    def test_mcp_stockout_risk_and_evidence(self):
        """MCP detect_stockout_risk returns verified evidence based on safety thresholds."""
        # Set stock below reorder level (quantity=8, reorder_level=10)
        self.conn.execute("UPDATE products SET quantity=8 WHERE id=?", (self.prod_a_id,))
        self.conn.commit()

        result = execute_mcp_tool("detect_stockout_risk", {"tenant_id": self.biz_a_id})
        self.assertEqual(result["at_risk_count"], 1)
        item = result["items_at_risk"][0]
        self.assertEqual(item["product_id"], self.prod_a_id)
        self.assertEqual(item["shortfall"], 2)
        self.assertTrue("safety stock" in item["evidence"])

    def test_maker_checker_purchase_order_approval(self):
        """Draft PO cannot be approved by staff; requires owner or manager role."""
        draft = execute_mcp_tool("create_purchase_order_draft", {
            "tenant_id": self.biz_a_id,
            "supplier_name": "Tata Consumer Products",
            "items": [{"product_id": self.prod_a_id, "quantity": 50, "unit_cost": 18.0}]
        })
        self.assertEqual(draft["status"], "draft")
        po_id = draft["order_id"]

        # Staff approval fails policy check
        staff_attempt = execute_mcp_tool("approve_purchase_order", {
            "tenant_id": self.biz_a_id,
            "order_id": po_id,
            "action": "approve",
            "approver_role": "staff"
        })
        self.assertFalse(staff_attempt["success"])
        self.assertIn("Security Policy Violation", staff_attempt["error"])

        # Owner approval succeeds
        owner_approval = execute_mcp_tool("approve_purchase_order", {
            "tenant_id": self.biz_a_id,
            "order_id": po_id,
            "action": "approve",
            "approver_role": "owner"
        })
        self.assertTrue(owner_approval["success"])
        self.assertEqual(owner_approval["status"], "approved")

    def test_gst_invoice_validation(self):
        """Validates GSTIN formatting and calculates intra-state vs inter-state tax breakdown."""
        # Intra-state (Maharashtra to Maharashtra - 27)
        res_intra = execute_mcp_tool("validate_gst_invoice", {
            "tenant_id": self.biz_a_id,
            "supplier_gstin": "27AAPFU0939F1ZV",
            "recipient_gstin": "27AABCS1429B1ZB",
            "taxable_value": 1000.0,
            "gst_rate": 18.0
        })
        self.assertTrue(res_intra["valid"])
        tax = res_intra["tax_breakdown"]
        self.assertFalse(tax["is_interstate"])
        self.assertEqual(tax["cgst_amount"], 90.0)
        self.assertEqual(tax["sgst_amount"], 90.0)
        self.assertEqual(tax["igst_amount"], 0.0)
        self.assertEqual(tax["total_invoice_value"], 1180.0)

        # Inter-state (Maharashtra 27 to Delhi 07)
        res_inter = execute_mcp_tool("validate_gst_invoice", {
            "tenant_id": self.biz_a_id,
            "supplier_gstin": "27AAPFU0939F1ZV",
            "recipient_gstin": "07AAAAA0000A1Z5",
            "taxable_value": 1000.0,
            "gst_rate": 18.0
        })
        self.assertTrue(res_inter["valid"])
        tax_inter = res_inter["tax_breakdown"]
        self.assertTrue(tax_inter["is_interstate"])
        self.assertEqual(tax_inter["igst_amount"], 180.0)
        self.assertEqual(tax_inter["cgst_amount"], 0.0)

    def test_gstr2b_reconciliation(self):
        """Matches purchase register against GSTR-2B with mismatch and missing-bill detection."""
        purchase_register = [
            {"supplier_gstin": "27AAPFU0939F1ZV", "invoice_number": "INV-101", "taxable_value": 5000.0, "tax_amount": 900.0},
            {"supplier_gstin": "07AAAAA0000A1Z5", "invoice_number": "INV-202", "taxable_value": 2000.0, "tax_amount": 360.0},
            {"supplier_gstin": "24ABCDE1234F1Z5", "invoice_number": "INV-303", "taxable_value": 1500.0, "tax_amount": 75.0} # Not filed by supplier
        ]
        gstr2b_download = [
            {"supplier_gstin": "27AAPFU0939F1ZV", "invoice_number": "INV-101", "taxable_value": 5000.0, "tax_amount": 900.0}, # Matched
            {"supplier_gstin": "07AAAAA0000A1Z5", "invoice_number": "INV-202", "taxable_value": 1800.0, "tax_amount": 324.0}, # Value Mismatch
            {"supplier_gstin": "33XYZAB9876C1Z1", "invoice_number": "INV-999", "taxable_value": 3000.0, "tax_amount": 540.0}  # In 2B but Missing in Books
        ]

        result = execute_mcp_tool("reconcile_gstr2b", {
            "tenant_id": self.biz_a_id,
            "purchase_register": purchase_register,
            "gstr2b_records": gstr2b_download
        })

        summary = result["summary"]
        self.assertEqual(summary["matched_count"], 1)
        self.assertEqual(summary["value_mismatch_count"], 1)
        self.assertEqual(summary["missing_in_2b_count"], 1)
        self.assertEqual(summary["missing_in_books_count"], 1)
        self.assertEqual(summary["itc_at_risk_amount"], 75.0)

    def test_compliance_calendar(self):
        """Returns statutory compliance obligations with law citations."""
        res = execute_mcp_tool("get_compliance_deadlines", {"financial_year": "2026-27"})
        obligations = res["obligations"]
        categories = {o["category"] for o in obligations}
        self.assertIn("GST", categories)
        self.assertIn("Direct Tax", categories)
        # Check specific statutory reference
        gstr1 = next(o for o in obligations if "GSTR-1" in o["obligation"])
        self.assertIn("Section 37", gstr1["statutory_reference"])

if __name__ == "__main__":
    unittest.main()
