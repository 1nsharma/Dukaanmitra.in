"""
ONDC Network Beckn Protocol v1.2 & WhatsApp Munim Billing Test Suite
Validates:
1. ONDC Beckn Discovery (/search -> on_search)
2. ONDC Item Selection & GST Quote Calculation (/select -> on_select)
3. ONDC Order Initialization (/init -> on_init)
4. ONDC Order Placement & Sale Ledger Recording (/confirm -> on_confirm)
5. ONDC Order Tracking & Cancellation Lifecycle (/status, /cancel)
6. ONDC Store Catalog Synchronization
7. WhatsApp Munim Billing & Maker-Checker Confirmation Flows
"""
import unittest, os, sys, sqlite3, json, uuid
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import app, superintelligence, dukaanmitra_platform, ondc_network
from ondc_network import (
    OndcBecknService, BecknContext, OndcSearchIn, OndcSelectIn, OndcInitIn,
    OndcConfirmIn, OndcStatusIn, OndcCancelIn, utc_now
)
from dukaanmitra_platform import WhatsAppAiBotGateway, AccessService, MerchantProvisionIn, init_platform_db

class TestOndcAndWhatsAppMunim(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.init_db()
        superintelligence.init_superintelligence_db(app.DB_PATH)
        init_platform_db(app.DB_PATH)

    def setUp(self):
        self.conn = sqlite3.connect(app.DB_PATH)
        self.conn.row_factory = sqlite3.Row

    def tearDown(self):
        self.conn.close()

    def _get_base_context(self, action: str = "search") -> BecknContext:
        return BecknContext(
            domain="nic2004:52110",
            country="IND",
            city="std:011",
            action=action,
            core_version="1.2.0",
            bap_id="buyerapp.ondc.org",
            bap_uri="https://buyerapp.ondc.org/protocol/v1",
            bpp_id="bpp.dukaanmitra.in",
            bpp_uri="https://api.dukaanmitra.in/api/v1/ondc",
            transaction_id=f"tx_{uuid.uuid4().hex[:8]}",
            message_id=f"msg_{uuid.uuid4().hex[:8]}"
        )

    # ─────────────────────────────────────────────────────────────────────────
    # 1. ONDC Beckn Protocol Discovery (search -> on_search)
    # ─────────────────────────────────────────────────────────────────────────
    def test_01_ondc_catalog_discovery_all_items(self):
        req = OndcSearchIn(
            context=self._get_base_context("search"),
            message={"intent": {}}
        )
        res = OndcBecknService.search(self.conn, req)

        self.assertEqual(res["context"]["action"], "on_search")
        self.assertEqual(res["context"]["bpp_id"], "bpp.dukaanmitra.in")
        catalog = res["message"]["catalog"]
        self.assertIn("bpp/descriptor", catalog)
        self.assertIn("bpp/providers", catalog)
        providers = catalog["bpp/providers"]
        self.assertGreater(len(providers), 0)
        items = providers[0]["items"]
        self.assertGreater(len(items), 0)

        # Validate item properties
        first_item = items[0]
        self.assertIn("price", first_item)
        self.assertIn("currency", first_item["price"])
        self.assertEqual(first_item["price"]["currency"], "INR")
        self.assertIn("tags", first_item)
        self.assertIn("fssai_licence_no", first_item["tags"])

    def test_02_ondc_catalog_filtered_search(self):
        req = OndcSearchIn(
            context=self._get_base_context("search"),
            message={"intent": {"item": {"descriptor": {"name": "Atta"}}}}
        )
        res = OndcBecknService.search(self.conn, req)
        items = res["message"]["catalog"]["bpp/providers"][0]["items"]
        self.assertGreater(len(items), 0)
        for it in items:
            self.assertIn("atta", it["descriptor"]["name"].lower())

    # ─────────────────────────────────────────────────────────────────────────
    # 2. ONDC Item Selection & Dynamic Quote Calculation (select -> on_select)
    # ─────────────────────────────────────────────────────────────────────────
    def test_03_ondc_quote_calculation_with_gst(self):
        req = OndcSelectIn(
            context=self._get_base_context("select"),
            message={
                "order": {
                    "provider": {"id": "dm_kirana_verified_01"},
                    "items": [
                        {"id": "sku_atta_5kg", "quantity": {"count": 1}},
                        {"id": "sku_oil_1l", "quantity": {"count": 2}}
                    ]
                }
            }
        )
        res = OndcBecknService.select(self.conn, req)
        self.assertEqual(res["context"]["action"], "on_select")
        quote = res["message"]["order"]["quote"]
        total_val = float(quote["price"]["value"])
        self.assertGreater(total_val, 500.0)

        titles = [b["title"] for b in quote["breakup"]]
        self.assertIn("CGST (2.5%)", titles)
        self.assertIn("SGST (2.5%)", titles)
        self.assertIn("Delivery Charges", titles)
        self.assertIn("Packing Charges", titles)

    # ─────────────────────────────────────────────────────────────────────────
    # 3. ONDC Order Initialization (init -> on_init)
    # ─────────────────────────────────────────────────────────────────────────
    def test_04_ondc_order_initialization(self):
        req = OndcInitIn(
            context=self._get_base_context("init"),
            message={
                "order": {
                    "provider": {"id": "dm_kirana_verified_01"},
                    "items": [{"id": "sku_atta_5kg", "quantity": {"count": 1}}],
                    "billing": {
                        "name": "Aakash Verma",
                        "phone": "+919876543210",
                        "address": {"city": "New Delhi", "area_code": "110001"}
                    },
                    "fulfillments": [
                        {
                            "id": "ful_1",
                            "type": "Delivery",
                            "end": {"location": {"gps": "28.6139,77.2090"}, "contact": {"phone": "+919876543210"}}
                        }
                    ]
                }
            }
        )
        res = OndcBecknService.init(self.conn, req)
        self.assertEqual(res["context"]["action"], "on_init")
        order = res["message"]["order"]
        self.assertEqual(order["billing"]["name"], "Aakash Verma")
        self.assertEqual(order["payment"]["type"], "ON-ORDER")

    # ─────────────────────────────────────────────────────────────────────────
    # 4. ONDC Order Placement (confirm -> on_confirm)
    # ─────────────────────────────────────────────────────────────────────────
    def test_05_ondc_order_confirmation(self):
        req = OndcConfirmIn(
            context=self._get_base_context("confirm"),
            message={
                "order": {
                    "provider": {"id": "dm_kirana_verified_01"},
                    "items": [{"id": "sku_atta_5kg", "quantity": {"count": 1}}],
                    "billing": {
                        "name": "Sunil Kumar",
                        "phone": "+919811122233",
                        "address": {"city": "New Delhi", "area_code": "110001"}
                    },
                    "fulfillments": [
                        {"id": "ful_1", "type": "Delivery", "end": {"location": {"gps": "28.6139,77.2090"}}}
                    ],
                    "payment": {
                        "type": "ON-ORDER",
                        "status": "PAID",
                        "params": {"transaction_id": "upi_tx_12345"}
                    }
                }
            }
        )
        res = OndcBecknService.confirm(self.conn, req)
        self.assertEqual(res["context"]["action"], "on_confirm")
        order = res["message"]["order"]
        self.assertEqual(order["state"], "Accepted")
        self.assertTrue(order["id"].startswith("ONDC-ORD-"))

    # ─────────────────────────────────────────────────────────────────────────
    # 5. ONDC Tracking & Cancellation (status, cancel)
    # ─────────────────────────────────────────────────────────────────────────
    def test_06_ondc_status_tracking_and_cancel(self):
        status_req = OndcStatusIn(
            context=self._get_base_context("status"),
            message={"order_id": "ONDC-ORD-TEST123"}
        )
        stat_res = OndcBecknService.status(self.conn, status_req)
        self.assertEqual(stat_res["context"]["action"], "on_status")
        self.assertEqual(stat_res["message"]["order"]["state"], "In-Transit")

        cancel_req = OndcCancelIn(
            context=self._get_base_context("cancel"),
            message={"order_id": "ONDC-ORD-TEST123", "cancellation_reason_id": "001"}
        )
        canc_res = OndcBecknService.cancel(self.conn, cancel_req)
        self.assertEqual(canc_res["context"]["action"], "on_cancel")
        self.assertEqual(canc_res["message"]["order"]["state"], "Cancelled")

    # ─────────────────────────────────────────────────────────────────────────
    # 6. ONDC Store Catalog Synchronization
    # ─────────────────────────────────────────────────────────────────────────
    def test_07_ondc_catalog_sync(self):
        sync_res = OndcBecknService.sync_catalog(self.conn, "biz_test_01")
        self.assertTrue(sync_res["success"])
        self.assertEqual(sync_res["protocol"], "Beckn v1.2.0")
        self.assertGreaterEqual(sync_res["synced_products_count"], 1)

    # ─────────────────────────────────────────────────────────────────────────
    # 7. WhatsApp Munim Billing & Maker-Checker Flow
    # ─────────────────────────────────────────────────────────────────────────
    def test_08_whatsapp_munim_udhaar_and_approval(self):
        phone = f"+91980{uuid.uuid4().hex[:7]}"
        otp_res = AccessService.request_otp(self.conn, phone)
        AccessService.verify_otp(self.conn, phone, otp_res["dev_otp"])
        prov = AccessService.provision_merchant_shop(self.conn, MerchantProvisionIn(
            phone=phone, shop_name="Verma Kirana", owner_name="Verma Ji", business_kind="kirana"
        ))

        # Seed customer Ramesh in shop database
        self.conn.execute("""
            INSERT OR REPLACE INTO customers (id, business_id, name, phone, current_balance, created_at, updated_at)
            VALUES ('cust_ramesh', ?, 'Ramesh', '+919988776655', 0.0, ?, ?)
        """, (prov["business_id"], utc_now(), utc_now()))
        self.conn.commit()

        # Inbound WhatsApp Udhaar billing command
        msg_res = WhatsAppAiBotGateway.process_incoming_whatsapp_message(
            self.conn, phone, "Ramesh ki 250 udhaari likho"
        )
        self.assertEqual(msg_res["status"], "proposal_created")
        prop_id = msg_res["proposal_id"]
        self.assertIn("250", msg_res["whatsapp_reply"])

        # Merchant confirms via '1' / 'haan'
        confirm_res = WhatsAppAiBotGateway.process_incoming_whatsapp_message(
            self.conn, phone, "1"
        )
        self.assertEqual(confirm_res["status"], "approved")
        self.assertIn("Entry Saved", confirm_res["whatsapp_reply"])


if __name__ == "__main__":
    unittest.main()
