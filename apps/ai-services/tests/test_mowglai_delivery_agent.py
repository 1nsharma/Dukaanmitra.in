"""
Unit tests for Mowglai Website Delivery Agent v0.1
==================================================
Tests end-to-end workflow:
1. Client Brief Intake
2. AI Planning & Sitemap Generation
3. Sandboxed Code Generation (HTML5/CSS/JS)
4. Automated QA Verification (Viewport, SEO, WhatsApp CTA, Form, Links)
5. Human Approval Gate & Delivery Sign-off
"""

import sys
import os
import unittest
import shutil
import pathlib
import json

CURRENT_DIR = pathlib.Path(__file__).resolve().parent
AI_SERVICES_DIR = CURRENT_DIR.parent
if str(AI_SERVICES_DIR) not in sys.path:
    sys.path.insert(0, str(AI_SERVICES_DIR))

from mowglai_delivery_agent import MowglaiDeliveryService, ClientBriefIn, SANDBOX_BASE_DIR

class TestMowglaiDeliveryAgent(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.test_project_id = "test_gupta_kirana_s0"
        cls.test_sandbox = SANDBOX_BASE_DIR / cls.test_project_id

    @classmethod
    def tearDownClass(cls):
        if cls.test_sandbox.exists():
            shutil.rmtree(cls.test_sandbox, ignore_errors=True)

    def test_01_client_brief_intake(self):
        brief = ClientBriefIn(
            project_id=self.test_project_id,
            business_name="Gupta General Store",
            business_type="kirana",
            owner_name="Ramesh Gupta",
            phone="+919876543210",
            email="ramesh@guptastore.in",
            location="Jaipur, Rajasthan",
            pages=["home", "services", "about", "contact"]
        )
        res = MowglaiDeliveryService.create_project_brief(brief)
        self.assertEqual(res["project_id"], self.test_project_id)
        self.assertEqual(res["status"], "brief_accepted")
        self.assertTrue((self.test_sandbox / "brief.json").exists())

    def test_02_ai_planning(self):
        plan = MowglaiDeliveryService.generate_ai_plan(self.test_project_id)
        self.assertEqual(plan["project_id"], self.test_project_id)
        self.assertEqual(plan["status"], "plan_ready")
        self.assertTrue(len(plan["sitemap"]) >= 4)
        home_page = next(p for p in plan["sitemap"] if p["id"] == "home")
        self.assertIn("Gupta General Store", home_page["seo"]["title"])
        self.assertTrue((self.test_sandbox / "plan.json").exists())

    def test_03_sandboxed_site_generation(self):
        build = MowglaiDeliveryService.build_sandboxed_site(self.test_project_id)
        self.assertEqual(build["status"], "build_success")
        self.assertTrue((self.test_sandbox / "index.html").exists())
        html = (self.test_sandbox / "index.html").read_text(encoding="utf-8")
        self.assertIn("Gupta General Store", html)
        self.assertIn("https://wa.me/919876543210", html)
        self.assertIn("application/ld+json", html)
        self.assertIn("<meta name=\"viewport\"", html)

    def test_04_automated_qa_report(self):
        qa = MowglaiDeliveryService.run_qa_report(self.test_project_id)
        self.assertTrue(qa["passed"])
        self.assertEqual(len(qa["checks"]), 5)
        # All 5 QA checks must pass
        for c in qa["checks"]:
            self.assertTrue(c["passed"], f"QA check failed: {c['check']}")
        self.assertTrue((self.test_sandbox / "qa_report.json").exists())

    def test_05_human_approval_gate(self):
        appr = MowglaiDeliveryService.approve_and_handover(self.test_project_id, "Ramesh Gupta", "store_owner")
        self.assertEqual(appr["status"], "approved_for_launch")
        self.assertTrue(appr["certificate_id"].startswith("CERT-"))
        self.assertTrue((self.test_sandbox / "approval.json").exists())

    def test_06_edge_case_missing_plan_triggers_auto_plan(self):
        auto_proj_id = "test_auto_plan_project"
        auto_sandbox = SANDBOX_BASE_DIR / auto_proj_id
        try:
            brief = ClientBriefIn(
                project_id=auto_proj_id,
                business_name="Auto Plan Kirana",
                owner_name="Suresh Kumar",
                phone="+919876500000"
            )
            MowglaiDeliveryService.create_project_brief(brief)
            # Directly call build_sandboxed_site without calling generate_ai_plan explicitly
            build = MowglaiDeliveryService.build_sandboxed_site(auto_proj_id)
            self.assertEqual(build["status"], "build_success")
            self.assertTrue((auto_sandbox / "plan.json").exists())
            self.assertTrue((auto_sandbox / "index.html").exists())
        finally:
            shutil.rmtree(auto_sandbox, ignore_errors=True)

if __name__ == "__main__":
    unittest.main()
