"""
Unit & Integration Tests for DukaanMitra Core Brain Engine:
- Phase 1: Products, Customers, SalesLog, Frequency Analysis ("Sharma ji har 20 din me aata lete hain"),
           Inactive detection ("Gupta ji pichle 40 din se nahi aaye"), 3-Month Kirana Sales Data Simulation.
- Phase 2: MVP Magic Button ("Aaj ki AI Insights"), CSV/Vyapar Importer, Manual WhatsApp wa.me Link.
- Phase 3: MLP Voice Bookkeeping ("Mishra ji ne 5kg daal udhaar li"), Auto-Pilot WhatsApp OpenWA Trigger,
           Supplier Mandi Arbitrage Analyzer.
- Phase 4: MMP Subscription Tiers (Free, Silver ₹299, Gold ₹599).
"""

import unittest
import os
import sys
import sqlite3
import json
import uuid
from datetime import datetime, timezone, timedelta

# Ensure import paths
AI_SERVICES_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, AI_SERVICES_DIR)

import app
from core_brain import (
    init_core_brain_db,
    CoreBrainEngine,
    CsvImporter,
    VoiceBookkeepingParser,
    SupplierRateAnalyzer,
    get_or_create_subscription,
    TIER_PLANS
)

TEST_DB = os.path.join(AI_SERVICES_DIR, "test_core_brain.db")

class TestCoreBrainSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if os.path.exists(TEST_DB):
            os.remove(TEST_DB)
        # Initialize base app db and core brain db
        orig_db = app.DB_PATH
        app.DB_PATH = TEST_DB
        app.init_db()
        init_core_brain_db(TEST_DB)
        app.DB_PATH = orig_db

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(TEST_DB):
            try:
                os.remove(TEST_DB)
            except Exception:
                pass

    def setUp(self):
        self.conn = sqlite3.connect(TEST_DB)
        self.conn.row_factory = sqlite3.Row
        self.biz_id = "biz_jaipur_kirana_" + str(uuid.uuid4())[:8]
        now_ts = datetime.now(timezone.utc).isoformat()
        
        # Create test business
        self.conn.execute(
            "INSERT INTO businesses (id, name, kind, currency, created_at) VALUES(?,?,?,?,?)",
            (self.biz_id, "Sharma Kirana & General Store, Jaipur", "retail", "INR", now_ts)
        )
        self.conn.commit()

    def tearDown(self):
        self.conn.close()

    # ==========================================================================
    # PHASE 1 TESTS: The Core Brain (Backend PoC)
    # ==========================================================================
    def test_01_three_month_kirana_sales_simulation_and_frequency(self):
        """
        Loads 3 months of synthetic sales data for Sharma Kirana Store:
        - Sharma ji buys Aashirvaad Aata every 20 days (3 visits across 60 days).
        - Gupta ji used to buy every 15 days, but has not visited for 40 days (Missed / Churn Risk).
        - Verma ji visits every 7 days for milk & bread.
        """
        now = datetime.now(timezone.utc)
        d_60_days_ago = (now - timedelta(days=60)).strftime("%Y-%m-%d")
        d_40_days_ago = (now - timedelta(days=40)).strftime("%Y-%m-%d")
        d_20_days_ago = (now - timedelta(days=20)).strftime("%Y-%m-%d")
        d_today = now.strftime("%Y-%m-%d")

        # 1. Sharma ji's 20-day cycle records
        sales = [
            (str(uuid.uuid4()), self.biz_id, "Sharma ji", "9829012345", json.dumps([{"name": "Aashirvaad Aata 10kg", "quantity": 1, "price": 380}]), 380.0, "cash", d_60_days_ago, now.isoformat()),
            (str(uuid.uuid4()), self.biz_id, "Sharma ji", "9829012345", json.dumps([{"name": "Aashirvaad Aata 10kg", "quantity": 1, "price": 380}]), 380.0, "cash", d_40_days_ago, now.isoformat()),
            (str(uuid.uuid4()), self.biz_id, "Sharma ji", "9829012345", json.dumps([{"name": "Aashirvaad Aata 10kg", "quantity": 1, "price": 380}, {"name": "Fortune Oil 1L", "quantity": 1, "price": 140}]), 520.0, "cash", d_20_days_ago, now.isoformat()),
        ]

        # 2. Gupta ji's inactive records (Last visit 40 days ago, previous visits 55 & 70 days ago)
        d_70_days_ago = (now - timedelta(days=70)).strftime("%Y-%m-%d")
        d_55_days_ago = (now - timedelta(days=55)).strftime("%Y-%m-%d")
        sales += [
            (str(uuid.uuid4()), self.biz_id, "Gupta ji", "9829054321", json.dumps([{"name": "India Gate Basmati Rice", "quantity": 1, "price": 450}]), 450.0, "cash", d_70_days_ago, now.isoformat()),
            (str(uuid.uuid4()), self.biz_id, "Gupta ji", "9829054321", json.dumps([{"name": "India Gate Basmati Rice", "quantity": 1, "price": 450}]), 450.0, "cash", d_55_days_ago, now.isoformat()),
            (str(uuid.uuid4()), self.biz_id, "Gupta ji", "9829054321", json.dumps([{"name": "India Gate Basmati Rice", "quantity": 1, "price": 450}]), 450.0, "cash", d_40_days_ago, now.isoformat()),
        ]

        # 3. Verma ji's frequent 7-day visits
        d_14_days_ago = (now - timedelta(days=14)).strftime("%Y-%m-%d")
        d_7_days_ago = (now - timedelta(days=7)).strftime("%Y-%m-%d")
        sales += [
            (str(uuid.uuid4()), self.biz_id, "Verma ji", "9829099999", json.dumps([{"name": "Amul Milk", "quantity": 2, "price": 66}]), 132.0, "cash", d_14_days_ago, now.isoformat()),
            (str(uuid.uuid4()), self.biz_id, "Verma ji", "9829099999", json.dumps([{"name": "Amul Milk", "quantity": 2, "price": 66}]), 132.0, "cash", d_7_days_ago, now.isoformat()),
            (str(uuid.uuid4()), self.biz_id, "Verma ji", "9829099999", json.dumps([{"name": "Amul Milk", "quantity": 2, "price": 66}]), 132.0, "cash", d_today, now.isoformat()),
        ]

        self.conn.executemany(
            """
            INSERT INTO sales_log (id, business_id, customer_name, customer_phone, items_json, total_amount, payment_mode, sale_date, created_at)
            VALUES(?,?,?,?,?,?,?,?,?)
            """,
            sales
        )
        self.conn.commit()

        # Step A: Run Customer Frequency Calculation
        frequencies = CoreBrainEngine.calculate_customer_frequencies(self.conn, self.biz_id)
        freq_map = {f["customer_name"]: f for f in frequencies}

        self.assertIn("Sharma ji", freq_map)
        self.assertIn("Gupta ji", freq_map)
        self.assertIn("Verma ji", freq_map)

        # Check Sharma ji's 20-day interval
        sharma_prof = freq_map["Sharma ji"]
        self.assertEqual(sharma_prof["avg_interval_days"], 20.0)
        self.assertIn("har 20 din me", sharma_prof["frequency_summary"])
        self.assertIn("Aashirvaad Aata", sharma_prof["top_item"])

        # Check Gupta ji's 15-day interval
        gupta_prof = freq_map["Gupta ji"]
        self.assertEqual(gupta_prof["avg_interval_days"], 15.0)

        # Check Verma ji's 7-day interval
        verma_prof = freq_map["Verma ji"]
        self.assertEqual(verma_prof["avg_interval_days"], 7.0)
        self.assertIn("har hafte", verma_prof["frequency_summary"])

        # Step B: Run Inactive / Missed Customer Detection
        missed = CoreBrainEngine.detect_missed_customers(frequencies, reference_date=now)
        missed_names = [m["customer_name"] for m in missed]

        # Gupta ji should be flagged because last visit was 40 days ago (> 2.5x of 15 day cycle!)
        self.assertIn("Gupta ji", missed_names)
        gupta_missed = next(m for m in missed if m["customer_name"] == "Gupta ji")
        self.assertEqual(gupta_missed["days_inactive"], 40)
        self.assertEqual(gupta_missed["urgency"], "CRITICAL")
        self.assertIn("40 din se nahi aaye", gupta_missed["insight"])

        # Verma ji visited today, so should NOT be in missed list
        self.assertNotIn("Verma ji", missed_names)

        # Step C: Generate Hinglish Ready Offers
        offers = CoreBrainEngine.generate_ready_offers(missed, shop_name="Sharma Kirana")
        self.assertTrue(len(offers) >= 1)
        gupta_offer = next(o for o in offers if o["customer_name"] == "Gupta ji")

        self.assertIn("Namaste Gupta ji", gupta_offer["message_text"])
        self.assertIn("India Gate Basmati Rice", gupta_offer["message_text"])
        self.assertIn("Free Home Delivery", gupta_offer["message_text"])
        # Check WhatsApp redirect URL
        self.assertTrue(gupta_offer["whatsapp_redirect_url"].startswith("https://wa.me/919829054321?text="))

    # ==========================================================================
    # PHASE 2 TESTS: The MVP (CSV Upload & Magic Button Insights)
    # ==========================================================================
    def test_02_csv_importer_and_magic_button_dashboard(self):
        """
        Tests CSV import simulating Vyapar/Khatabook export and the 'Magic Button' (Aaj ki AI Insights).
        """
        csv_data = """Date,Customer,Phone,Item,Quantity,Amount,Payment
2026-10-01,Ramesh Patel,9829011111,Tata Salt 1kg,2,52,cash
2026-10-05,Suresh Meena,9829022222,Fortune Oil 1L,1,145,udhaar
2026-10-10,Ramesh Patel,9829011111,Tata Salt 1kg,2,52,cash
2026-10-20,Ramesh Patel,9829011111,Tata Salt 1kg,2,52,cash
"""
        import_res = CsvImporter.parse_and_ingest(self.conn, self.biz_id, csv_data)
        self.conn.commit()

        self.assertEqual(import_res["status"], "success")
        self.assertEqual(import_res["inserted_sales"], 4)
        self.assertTrue(import_res["new_customers_created"] >= 2)

        # Add a low stock product to verify urgent re-orders
        prod_id = "prd_" + str(uuid.uuid4())
        self.conn.execute(
            """
            INSERT INTO products (id, business_id, name, unit, quantity, reorder_level, cost_price, selling_price, created_at, updated_at)
            VALUES(?,?,?,?,?,?,?,?,?,?)
            """,
            (prod_id, self.biz_id, "MDH Deggi Mirch 100g", "pkt", 2.0, 10.0, 75.0, 90.0, now_iso(), now_iso())
        )
        self.conn.commit()

        # Test Magic Button API logic
        reorders = CoreBrainEngine.detect_urgent_reorders(self.conn, self.biz_id)
        self.assertTrue(len(reorders) >= 1)
        mirch = next((r for r in reorders if "MDH" in r["name"]), None)
        self.assertIsNotNone(mirch)
        self.assertEqual(mirch["current_stock"], 2.0)
        self.assertEqual(mirch["urgency"], "CRITICAL")

    # ==========================================================================
    # PHASE 3 TESTS: The MLP (Voice Bookkeeping & Supplier Arbitrage)
    # ==========================================================================
    def test_03_voice_bookkeeping_and_supplier_arbitrage(self):
        """
        Tests:
        1. Voice Bookkeeping: 'Mishra ji ne 5kg daal udhaar li' -> records udhaar debit & updates balance.
        2. Voice Bookkeeping: 'Sharma ji ne 500 rupaye jama karwaye' -> records credit & reduces balance.
        3. Supplier Arbitrage: Compares shop's cost prices with Mandi rates to find savings.
        """
        # 1. Voice Udhaar Entry
        res1 = VoiceBookkeepingParser.parse_speech_command(self.conn, self.biz_id, "Mishra ji ne 500 rupaye udhaar li")
        self.conn.commit()
        self.assertEqual(res1["action"], "udhaar_recorded")
        self.assertIn("Mishra", res1["customer_name"])
        self.assertEqual(res1["amount"], 500.0)
        self.assertEqual(res1["new_balance"], 500.0)

        # 2. Voice Jama Entry (Payment Received)
        res2 = VoiceBookkeepingParser.parse_speech_command(self.conn, self.biz_id, "Mishra ji ne 200 rupaye jama kiye")
        self.conn.commit()
        self.assertEqual(res2["action"], "payment_received")
        self.assertEqual(res2["amount"], 200.0)
        self.assertEqual(res2["new_balance"], 300.0)

        # 3. Supplier Arbitrage Test
        # Add products with cost higher than Mandi rate
        self.conn.execute(
            """
            INSERT INTO products (id, business_id, name, unit, quantity, reorder_level, cost_price, selling_price, created_at, updated_at)
            VALUES(?,?,?,?,?,?,?,?,?,?)
            """,
            (str(uuid.uuid4()), self.biz_id, "Aashirvaad Aata 10kg", "bag", 20.0, 5.0, 395.0, 430.0, now_iso(), now_iso())
        )
        self.conn.commit()

        analysis = SupplierRateAnalyzer.analyze_margins_and_savings(self.conn, self.biz_id)
        self.assertTrue(analysis["total_monthly_saving_potential"] > 0)
        self.assertTrue(analysis["arbitrage_count"] >= 1)
        aata_opp = analysis["opportunities"][0]
        self.assertIn("Aashirvaad", aata_opp["product_name"])
        self.assertEqual(aata_opp["your_cost_price"], 395.0)
        self.assertEqual(aata_opp["mandi_wholesale_rate"], 360.0)
        self.assertEqual(aata_opp["extra_cost_per_unit"], 35.0)

    # ==========================================================================
    # PHASE 4 TESTS: The MMP (Subscription Tiers & Monetization)
    # ==========================================================================
    def test_04_subscription_tiers_and_governance(self):
        """
        Tests Phase 4 MMP subscription plans (Free, Silver ₹299, Gold ₹599).
        """
        sub = get_or_create_subscription(self.conn, self.biz_id)
        self.assertIn("plan_tier", sub)
        self.assertIn("plan_details", sub)

        self.assertIn("free", TIER_PLANS)
        self.assertIn("silver_299", TIER_PLANS)
        self.assertIn("gold_599", TIER_PLANS)

        self.assertEqual(TIER_PLANS["silver_299"]["monthly_fee"], 299.0)
        self.assertEqual(TIER_PLANS["gold_599"]["monthly_fee"], 599.0)
        self.assertIn("openwa_autopilot_marketing", TIER_PLANS["gold_599"]["features"])
        self.assertIn("voice_bookkeeping", TIER_PLANS["silver_299"]["features"])

def now_iso():
    return datetime.now(timezone.utc).isoformat()

if __name__ == '__main__':
    unittest.main()
