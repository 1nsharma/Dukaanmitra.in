"""
DukaanMitra.in Platform, Public Verification, Merchant Access & AI WhatsApp Bot Test Suite
Verifies:
1. Domain Discovery & Corporate Credential Verification
2. Public Merchant Verification & Trust Badges
3. Self-Serve Phone/OTP Onboarding & Instant Provisioning
4. PWA Manifest & Offline Service Worker Assets
5. AI-Driven WhatsApp Bot Gateway with Interactive Maker-Checker Flow
6. Nginx Reverse Proxy Architecture
"""
import unittest, os, sys, sqlite3, json, uuid
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import app, superintelligence, dukaanmitra_platform
from dukaanmitra_platform import (
    PublicVerificationService, AccessService, WhatsAppAiBotGateway,
    MerchantProvisionIn, init_platform_db, utc_now,
    WhatsAppAdminDevConsoleService
)

class TestDukaanMitraInPlatform(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.init_db()
        superintelligence.init_superintelligence_db(app.DB_PATH)
        init_platform_db(app.DB_PATH)

    def setUp(self):
        self.conn = sqlite3.connect(app.DB_PATH)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys=ON")

    def tearDown(self):
        self.conn.close()

    # 1. Corporate Verification & Canonical Domain
    def test_01_corporate_verification_record(self):
        rec = PublicVerificationService.get_corporate_verification_record(self.conn)
        self.assertTrue(rec["verified"])
        self.assertEqual(rec["domain"], "dukaanmitra.in")
        self.assertEqual(rec["corporate_profile"]["cin"], "U72900DL2026PTC998877")
        self.assertEqual(rec["corporate_profile"]["gstin"], "07AAAAA0000A1Z5")
        self.assertTrue(rec["certificate_hash"].startswith("SHA256:"))
        self.assertTrue(rec["statutory_compliance"]["mca_cin_valid"])

    # 2. Public Merchant Verification
    def test_02_public_merchant_verification(self):
        # Ensure at least one verified shop
        self.conn.execute("INSERT OR REPLACE INTO businesses VALUES ('biz_test_verify', 'Kirana Central', 'kirana', 'INR', ?)", (utc_now(),))
        self.conn.commit()

        res = PublicVerificationService.verify_merchant(self.conn, "Kirana Central")
        self.assertTrue(res["verified"])
        self.assertIn("trust_badge", res)
        self.assertTrue(res["trust_badge"].startswith("DM-TRUST-"))
        self.assertEqual(res["merchant"]["trust_status"], "CERTIFIED_RETAIL_PARTNER")

        # Unknown shop
        unknown = PublicVerificationService.verify_merchant(self.conn, "NonExistentStoreXYZ")
        self.assertFalse(unknown["verified"])
        self.assertIn("No certified DukaanMitra merchant found", unknown["message"])

    # 3. Merchant Access, OTP & Instant Provisioning
    def test_03_merchant_otp_request_and_verify(self):
        phone = f"+91987{uuid.uuid4().hex[:7]}"
        req_res = AccessService.request_otp(self.conn, phone)
        self.assertTrue(req_res["success"])
        otp_code = req_res["dev_otp"]

        # Wrong OTP rejection
        with self.assertRaises(Exception):
            AccessService.verify_otp(self.conn, phone, "000000")

        # Correct OTP verification
        verify_res = AccessService.verify_otp(self.conn, phone, otp_code)
        self.assertTrue(verify_res["verified"])

    def test_04_instant_merchant_provisioning(self):
        phone = f"+91986{uuid.uuid4().hex[:7]}"
        otp_res = AccessService.request_otp(self.conn, phone)
        AccessService.verify_otp(self.conn, phone, otp_res["dev_otp"])

        prov_req = MerchantProvisionIn(
            phone=phone,
            shop_name="Balaji Medical Store",
            owner_name="Balaji Rao",
            business_kind="pharmacy"
        )
        prov_res = AccessService.provision_merchant_shop(self.conn, prov_req)
        
        self.assertTrue(prov_res["success"])
        self.assertTrue(prov_res["business_id"].startswith("biz_"))
        self.assertTrue(prov_res["api_key"].startswith("dm_live_"))
        self.assertIn("dukaanmitra.in", prov_res["app_url"])

        cur = self.conn.cursor()
        products = cur.execute("SELECT * FROM products WHERE business_id=?", (prov_res["business_id"],)).fetchall()
        self.assertGreaterEqual(len(products), 2)

    # 4. PWA Assets (manifest.json & sw.js)
    def test_05_pwa_assets_and_manifest(self):
        static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
        manifest_path = os.path.join(static_dir, "manifest.json")
        sw_path = os.path.join(static_dir, "sw.js")

        self.assertTrue(os.path.exists(manifest_path), "manifest.json must exist")
        self.assertTrue(os.path.exists(sw_path), "sw.js must exist")

        with open(manifest_path, "r", encoding="utf-8-sig") as f:
            manifest = json.load(f)
        self.assertEqual(manifest["display"], "standalone")
        self.assertEqual(manifest["theme_color"], "#1068eb")
        self.assertIn("DukaanMitra", manifest["short_name"])

        with open(sw_path, "r", encoding="utf-8-sig") as f:
            sw_code = f.read()
        self.assertIn("addEventListener('install'", sw_code)
        self.assertIn("addEventListener('fetch'", sw_code)

    # 5. AI-Driven WhatsApp Bot Gateway with Interactive Maker-Checker
    def test_06_whatsapp_ai_bot_interactive_ledger_write(self):
        phone = f"+91985{uuid.uuid4().hex[:7]}"
        otp_res = AccessService.request_otp(self.conn, phone)
        AccessService.verify_otp(self.conn, phone, otp_res["dev_otp"])
        prov = AccessService.provision_merchant_shop(self.conn, MerchantProvisionIn(
            phone=phone,
            shop_name="Kisan Kirana WhatsApp",
            owner_name="Kisan Lal",
            business_kind="kirana"
        ))
        biz_id = prov["business_id"]

        # Seed customer
        self.conn.execute("INSERT OR REPLACE INTO customers (id, business_id, name, phone, current_balance, created_at, updated_at) VALUES ('cust_wa_1', ?, 'Ramesh Kumar', '9876500000', 0.0, ?, ?)",
                          (biz_id, utc_now(), utc_now()))
        self.conn.commit()

        # Step A: Inbound natural language command via WhatsApp
        msg1 = "Ramesh Kumar ki 500 udhari likho"
        res1 = WhatsAppAiBotGateway.process_incoming_whatsapp_message(self.conn, phone, msg1)
        
        self.assertEqual(res1["status"], "proposal_created")
        self.assertIn("500", res1["whatsapp_reply"])
        self.assertIn("1", res1["whatsapp_reply"])

        # Verify proposal exists in database
        cur = self.conn.cursor()
        prop = cur.execute("SELECT * FROM proposals WHERE id=?", (res1["proposal_id"],)).fetchone()
        self.assertIsNotNone(prop)
        self.assertEqual(prop["status"], "pending_approval")

        # Step B: Merchant confirms proposal via WhatsApp sending "1"
        res2 = WhatsAppAiBotGateway.process_incoming_whatsapp_message(self.conn, phone, "1")
        self.assertEqual(res2["status"], "approved")
        self.assertIn("500", res2["whatsapp_reply"])

        # Verify ledger updated atomically
        updated_prop = cur.execute("SELECT status FROM proposals WHERE id=?", (res1["proposal_id"],)).fetchone()
        self.assertEqual(updated_prop["status"], "approved")

        cust = cur.execute("SELECT current_balance FROM customers WHERE id='cust_wa_1'").fetchone()
        self.assertEqual(cust["current_balance"], 500.0)

    def test_07_whatsapp_ai_bot_query_and_rejection(self):
        phone = f"+91984{uuid.uuid4().hex[:7]}"
        otp_res = AccessService.request_otp(self.conn, phone)
        AccessService.verify_otp(self.conn, phone, otp_res["dev_otp"])
        prov = AccessService.provision_merchant_shop(self.conn, MerchantProvisionIn(
            phone=phone,
            shop_name="Ganesh Store WhatsApp",
            owner_name="Ganesh",
            business_kind="kirana"
        ))
        biz_id = prov["business_id"]

        self.conn.execute("INSERT OR REPLACE INTO customers (id, business_id, name, phone, current_balance, created_at, updated_at) VALUES ('cust_wa_2', ?, 'Ramesh Kumar', '9876500000', 0.0, ?, ?)",
                          (biz_id, utc_now(), utc_now()))
        self.conn.commit()

        # 1. Total sales report query
        res_query = WhatsAppAiBotGateway.process_incoming_whatsapp_message(self.conn, phone, "aaj ki total sales batao")
        self.assertEqual(res_query["status"], "answered")
        self.assertIn("sales", res_query["whatsapp_reply"].lower())

        # 2. Proposal rejection test
        msg_prop = "Ramesh Kumar ki 200 udhari likho"
        res_prop = WhatsAppAiBotGateway.process_incoming_whatsapp_message(self.conn, phone, msg_prop)
        self.assertEqual(res_prop["status"], "proposal_created")

        # Merchant cancels by replying "2"
        res_reject = WhatsAppAiBotGateway.process_incoming_whatsapp_message(self.conn, phone, "2")
        self.assertEqual(res_reject["status"], "rejected")

    # 6. Nginx Configuration Integrity
    def test_08_nginx_configuration_integrity(self):
        repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        nginx_conf = os.path.join(repo_root, "nginx", "dukaanmitra.in.conf")
        self.assertTrue(os.path.exists(nginx_conf), f"nginx/dukaanmitra.in.conf must exist at {nginx_conf}")

        with open(nginx_conf, "r", encoding="utf-8-sig") as f:
            conf = f.read()

        self.assertIn("server_name dukaanmitra.in", conf)
        self.assertIn("proxy_pass http://dukaanmitra_ai_web;", conf)
        self.assertIn("proxy_pass http://dukaanmitra_core_engine;", conf)
        self.assertIn("Strict-Transport-Security", conf)

# 7. WhatsApp Admin Testing Dev Console & Telemetry
    def test_09_whatsapp_admin_dev_console_presets(self):
        presets = WhatsAppAdminDevConsoleService.get_presets()
        self.assertGreaterEqual(len(presets), 5)
        preset_ids = [p["id"] for p in presets]
        self.assertIn("preset_udhaar", preset_ids)
        self.assertIn("preset_maker_checker_approve", preset_ids)
        self.assertIn("preset_maker_checker_reject", preset_ids)

    def test_10_whatsapp_admin_dev_console_simulation_and_reset(self):
        phone = f"+91983{uuid.uuid4().hex[:7]}"
        # Seed merchant
        otp_res = AccessService.request_otp(self.conn, phone)
        AccessService.verify_otp(self.conn, phone, otp_res["dev_otp"])
        prov = AccessService.provision_merchant_shop(self.conn, MerchantProvisionIn(
            phone=phone, shop_name="DevConsole Shop", owner_name="Dev Tester", business_kind="kirana"
        ))
        
        # Test simulate inbound
        sim_res = WhatsAppAdminDevConsoleService.simulate_inbound(self.conn, {
            "phone": phone,
            "message": "10 packet bread stock mein daal do"
        })
        self.assertIn("gateway_result", sim_res)
        self.assertIn("meta_cloud_webhook_payload", sim_res)
        self.assertEqual(sim_res["meta_cloud_webhook_payload"]["object"], "whatsapp_business_account")
        self.assertIn("entry", sim_res["meta_cloud_webhook_payload"])

        # Test session reset
        reset_res = WhatsAppAdminDevConsoleService.reset_session(self.conn, phone)
        self.assertTrue(reset_res["success"])
        sessions = WhatsAppAdminDevConsoleService.list_sessions(self.conn)
        phone_cleaned = "".join([c for c in phone if c.isdigit()])
        active_for_phone = [s for s in sessions if s["phone"] == phone_cleaned]
        self.assertEqual(len(active_for_phone), 0)

    def test_11_whatsapp_admin_dev_console_telemetry(self):
        telemetry = WhatsAppAdminDevConsoleService.get_telemetry(self.conn)
        self.assertIn("total_whatsapp_sessions", telemetry)
        self.assertIn("pending_maker_checker_proposals", telemetry)
        self.assertIn("recent_audit_logs", telemetry)
        self.assertIn("recent_proposals", telemetry)

if __name__ == '__main__':
    unittest.main()
