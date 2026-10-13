"""
Unit and Integration Tests for Company Entity, Cap Table & Launch Modules
DukaanMitra AI Technologies Private Limited
"""
import unittest, os, sys, sqlite3, uuid
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import app, company_entity
from company_entity import CompanyService, CompanyProfileRequest, init_company_db

class TestCompanyAndLaunch(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.init_db()
        init_company_db(app.DB_PATH)

    def setUp(self):
        self.conn = sqlite3.connect(app.DB_PATH, timeout=30.0)
        self.conn.row_factory = sqlite3.Row

    def tearDown(self):
        self.conn.close()

    def test_01_company_registration_and_founding_cap_table(self):
        """Verify corporate incorporation seeds Amit Sharma (85%) and ESOP (15%)."""
        req = CompanyProfileRequest(
            legal_name="DukaanMitra AI Technologies Private Limited",
            trade_name="DukaanMitra OS",
            cin="U72900DL2026PTC998877",
            gstin="07AAAAA0000A1Z5",
            pan="AAAAA0000A",
            tan="DELA00000A",
            udyam_registration="UDYAM-DL-01-0012345",
            dpiit_recognition="DIPP98765"
        )
        res = CompanyService.register_or_update_company(self.conn, req)
        self.assertIn("company", res)
        self.assertEqual(res["company"]["legal_name"], "DukaanMitra AI Technologies Private Limited")
        self.assertEqual(res["company"]["cin"], "U72900DL2026PTC998877")

        # Cap Table check
        cap = res["cap_table"]
        self.assertEqual(len(cap), 2)
        founder = next(c for c in cap if c["role"] == "founder")
        esop = next(c for c in cap if c["role"] == "esop_pool")

        self.assertEqual(founder["shareholder_name"], "Amit Sharma")
        self.assertEqual(founder["equity_pct"], 85.0)
        self.assertEqual(esop["equity_pct"], 15.0)

    def test_02_statutory_compliance_calendar_seeded(self):
        """Verify standard statutory tasks (GST, TDS, ROC) are scheduled."""
        res = CompanyService.get_company_profile(self.conn)
        cal = res["statutory_calendar"]
        self.assertTrue(len(cal) >= 4)
        types = [t["compliance_type"] for t in cal]
        self.assertIn("GST", types)
        self.assertIn("TDS", types)
        self.assertIn("ROC", types)

    def test_03_multi_branch_outlet_hierarchy(self):
        """Verify enterprise company can attach retail branch outlets."""
        c_prof = CompanyService.get_company_profile(self.conn)
        company_id = c_prof["company"]["id"]

        # Create dummy business store
        biz_id = f"store_delhi_{uuid.uuid4().hex[:6]}"
        self.conn.execute("INSERT INTO businesses VALUES (?, ?, ?, ?, ?)",
                          (biz_id, "Sharma Kirana Connaught Place", "retail", "INR", "2026-10-13T00:00:00Z"))
        self.conn.commit()

        branch = CompanyService.add_branch_outlet(
            self.conn, company_id, biz_id, "Central Connaught Place Outlet", "New Delhi", "110001"
        )
        self.assertEqual(branch["branch_name"], "Central Connaught Place Outlet")
        self.assertEqual(branch["status"], "active")

        # Verify branch in profile
        updated_prof = CompanyService.get_company_profile(self.conn, company_id)
        self.assertTrue(any(b["branch_name"] == "Central Connaught Place Outlet" for b in updated_prof["branches"]))

        # Cleanup dummy business
        self.conn.execute("DELETE FROM company_branches WHERE business_id=?", (biz_id,))
        self.conn.execute("DELETE FROM businesses WHERE id=?", (biz_id,))
        self.conn.commit()

if __name__ == "__main__":
    unittest.main()
