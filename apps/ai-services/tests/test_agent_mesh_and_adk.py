"""
Test suite for DukaanMitra ADK (Agent Development Kit) & Agent Mesh Orchestrator
"""

import unittest
import sys
import os
import asyncio

# Setup paths
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, os.path.join(PROJECT_ROOT, "sdks", "agent-development-kit"))
sys.path.insert(0, os.path.join(PROJECT_ROOT, "packages", "agent-mesh"))

from dukan_mitra_adk import BaseAgent, SandboxTool, SandboxGovernor, AgentRouter, GovernorAlert
from orchestrator import DukanMitraAgentMeshOrchestrator, MunimAIAgent, InventoryAIAgent, GrowthGMBAgent

class TestAgentMeshAndAdk(unittest.TestCase):
    def test_01_router_intent_classification(self):
        """Verifies router classifies natural language into domain categories."""
        router = AgentRouter()
        self.assertEqual(router.classify_intent("Mishra ji ne 5kg daal udhaar li"), "accounting")
        self.assertEqual(router.classify_intent("Sharma ji ne 500 jama karwaye"), "accounting")
        self.assertEqual(router.classify_intent("Kaun sa maal stock me khatam hone wala hai?"), "inventory")
        self.assertEqual(router.classify_intent("Google My Business par local reviews check karo aur offer bhejo"), "marketing")
        self.assertEqual(router.classify_intent("2 packet milk bhejo ghar par"), "commerce")

    def test_02_sandbox_governor_security_limits(self):
        """Verifies SandboxGovernor blocks high spending and destructive commands."""
        # 1. Normal spending is approved
        approved, reason = SandboxGovernor.inspect_action("store_001", "record_udhaar", {"amount": 250.0}, max_auto_spend=1000.0)
        self.assertTrue(approved)
        self.assertEqual(reason, "ACTION_APPROVED")

        # 2. Exceeding spending limit requires human approval
        approved2, reason2 = SandboxGovernor.inspect_action("store_001", "record_udhaar", {"amount": 5500.0}, max_auto_spend=1000.0)
        self.assertFalse(approved2)
        self.assertIn("exceeds automated safety threshold", reason2)

        # 3. Destructive SQL injection is blocked
        with self.assertRaises(GovernorAlert):
            SandboxGovernor.inspect_action("store_001", "custom_tool", {"query": "DROP TABLE customers"})

    def test_03_agent_mesh_orchestration(self):
        """Tests the unified agent orchestrator dispatching tasks to specialist agents."""
        async def run_async():
            orchestrator = DukanMitraAgentMeshOrchestrator(tenant_id="store_jaipur_01")

            # A. Test Munim Agent
            res1 = await orchestrator.dispatch_omnichannel_command("Mishra ji ne 500 rupaye udhaar liye")
            self.assertEqual(res1["status"], "SUCCESS")
            self.assertIn("Munim AI", res1["message"])

            # B. Test Inventory Agent
            res2 = await orchestrator.dispatch_omnichannel_command("Stock khatam hone wala check karo")
            self.assertEqual(res2["status"], "SUCCESS")
            self.assertIn("Inventory Agent", res2["message"])

            # C. Test Growth Agent
            res3 = await orchestrator.dispatch_omnichannel_command("GMB profile par promotional offer broadcast karo")
            self.assertEqual(res3["status"], "SUCCESS")
            self.assertIn("GMB Agent", res3["message"])

        asyncio.run(run_async())

if __name__ == '__main__':
    unittest.main()
