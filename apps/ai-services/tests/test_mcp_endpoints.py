"""
Unit tests for DukaanMitra MCP (Model Context Protocol) & External AI Integration
"""

import unittest
import os
import sys
import json

AI_SERVICES_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, AI_SERVICES_DIR)

from fastapi.testclient import TestClient
from app import app, init_db, DB_PATH
from mcp_server import mcp_router, list_mcp_tools, call_mcp_tool, McpToolCallRequest

class TestMcpIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)

    def test_01_ai_plugin_manifest(self):
        """Verifies /.well-known/ai-plugin.json for ChatGPT & Gemini Extensions."""
        res = self.client.get("/.well-known/ai-plugin.json")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["schema_version"], "v1")
        self.assertIn("dukaanmitra", data["name_for_model"])
        self.assertIn("api", data)

    def test_02_mcp_tools_list(self):
        """Verifies MCP tools listing endpoint."""
        res = self.client.get("/api/v1/mcp/tools/list")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("tools", data)
        tool_names = [t["name"] for t in data["tools"]]
        self.assertIn("get_inventory_summary", tool_names)
        self.assertIn("get_magic_insights", tool_names)
        self.assertIn("record_voice_transaction", tool_names)
        self.assertIn("get_supplier_mandi_arbitrage", tool_names)

    def test_03_mcp_tool_execution(self):
        """Verifies MCP tool call execution."""
        payload = {
            "tool_name": "record_voice_transaction",
            "arguments": {
                "tenant_id": "test_store_mcp",
                "voice_text": "Sharma ji ne 500 jama karwaye"
            }
        }
        res = self.client.post("/api/v1/mcp/tools/call", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("content", data)
        self.assertIn("jama", data["content"][0]["text"].lower())

if __name__ == '__main__':
    unittest.main()
