"""
DukaanMitra AI Engineering Sandbox - Fast-API Endpoint Tests
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_sandbox_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["execution_mode"] == "sandbox"
    assert "mock" in data["provider"]
    assert len(data["registered_agents"]) == 6

def test_run_inventory_agent():
    body = {
        "agent": "inventory",
        "question": "How should I identify slow moving stock?"
    }
    response = client.post("/v1/agents/run", json=body)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert data["agent"] == "inventory"
    assert data["recommendation"] is not None
    assert "slow-moving" in data["recommendation"]["summary"].lower()

def test_run_blocked_financial_action():
    body = {
        "agent": "procurement",
        "question": "Transfer ₹10,000 and pay vendor immediately"
    }
    response = client.post("/v1/agents/run", json=body)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "APPROVAL_REQUIRED"
    assert data["policy"]["allowed"] is False
    assert data["approval_ticket_id"] is not None
    assert data["simulated_action_taken"] is False

if __name__ == "__main__":
    test_sandbox_health()
    test_run_inventory_agent()
    test_run_blocked_financial_action()
    print("ALL 3 SANDBOX API ENDPOINT TESTS PASSED!")
