"""
Tests for Slack Approval Gate Webhook and Status Endpoints.
"""

import pytest
from slack_gate.approval_listener import create_gate_app

@pytest.fixture
def gate_client():
    app = create_gate_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_slack_gate_health(gate_client):
    res = gate_client.get("/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "HEALTHY"

def test_slack_gate_plan_and_approval_flow(gate_client):
    # 1. Check initial status
    res = gate_client.get("/slack/gate/status")
    assert res.status_code == 200
    
    # 2. Submit Triage Plan
    plan_payload = {
        "incident_id": "INC-504-001",
        "author": "BobShell Autonomous Agent",
        "plan": {
            "title": "PostgREST Resource Embedding Query Refactor",
            "projected_latency_drop": "1280ms -> 25ms (-98%)",
            "finops_savings": "$140.00/mo compute tier reduction"
        }
    }
    res_plan = gate_client.post("/slack/triage/plan", json=plan_payload)
    assert res_plan.status_code == 200
    assert res_plan.get_json()["gate"]["status"] == "PENDING_APPROVAL"

    # 3. Approve Action
    approve_payload = {
        "approver": "Principal SRE (Human-in-the-Loop)",
        "notes": "Verified sandbox benchmark results. Approved."
    }
    res_approve = gate_client.post("/slack/action/approve", json=approve_payload)
    assert res_approve.status_code == 200
    assert res_approve.get_json()["gate"]["status"] == "APPROVED"
    assert res_approve.get_json()["gate"]["approver"] == "Principal SRE (Human-in-the-Loop)"
