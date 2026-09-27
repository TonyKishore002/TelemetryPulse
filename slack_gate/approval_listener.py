"""
Slack Approval Gate Server.
Provides lightweight HTTP/webhook endpoints for SRE Plan-Mode triage,
interactive Slack interactive payloads, and human-in-the-loop approval triggers.
"""

import os
import json
import time
import logging
from typing import Dict, Any
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("telemetrypulse.slack_gate")

# In-memory incident gate store
_GATE_STATE = {
    "status": "IDLE", # IDLE, PENDING_APPROVAL, APPROVED, REJECTED, DEPLOYED
    "incident_id": "INC-504-001",
    "proposed_plan": {
        "title": "PostgREST Resource Embedding Query Refactor",
        "description": "Replace unbatched N+1 sequential loop in GET /api/v1/orders/summary with batched client.table('orders').select('*, order_items(*)')",
        "projected_latency_drop": "1280ms -> 25ms (-98%)",
        "query_reduction": "101 queries -> 1 query",
        "finops_savings": "$140.00/mo compute tier reduction",
        "verification_status": "PASSED (Task A, B, C verified in BobShell sandbox)"
    },
    "approver": None,
    "approved_at": None,
    "audit_trail": [
        {
            "timestamp": "2026-09-26T12:00:05Z",
            "action": "INCIDENT_DETECTED",
            "actor": "IBM Instana APM",
            "details": "Alert INC-504-001: P99 latency exceeded 1280ms on /api/v1/orders/summary"
        },
        {
            "timestamp": "2026-09-26T12:00:20Z",
            "action": "TRIAGE_COMPLETED",
            "actor": "BobShell Autonomous Agent",
            "details": "Plan Mode triage completed. Sandboxed verification passed with 38x speedup."
        }
    ]
}

slack_gate_bp = Blueprint("slack_gate", __name__)

@slack_gate_bp.route("/slack/gate/status", methods=["GET"])
def get_status():
    """Returns the current gate status, proposed remediation plan, and audit trail."""
    return jsonify({
        "success": True,
        "gate": _GATE_STATE
    }), 200

@slack_gate_bp.route("/slack/triage/plan", methods=["POST"])
def submit_triage_plan():
    """
    Receives an incident triage proposal from BobShell / AI Agent,
    formats a Slack interactive message block, and transitions state to PENDING_APPROVAL.
    """
    data = request.get_json(silent=True) or {}
    incident_id = data.get("incident_id", "INC-504-001")
    plan_details = data.get("plan", _GATE_STATE["proposed_plan"])

    _GATE_STATE["incident_id"] = incident_id
    _GATE_STATE["proposed_plan"] = plan_details
    _GATE_STATE["status"] = "PENDING_APPROVAL"
    _GATE_STATE["approver"] = None
    _GATE_STATE["approved_at"] = None

    event = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "action": "PLAN_SUBMITTED_FOR_APPROVAL",
        "actor": data.get("author", "BobShell Autonomous Agent"),
        "details": f"Remediation plan submitted for {incident_id}. Waiting for human sign-off."
    }
    _GATE_STATE["audit_trail"].append(event)
    logger.info(f"Plan submitted for {incident_id}. Gate status: PENDING_APPROVAL")

    # Simulate Slack Block Kit payload
    slack_blocks = {
        "channel": "#incident-war-room",
        "blocks": [
            {
                "type": "header",
                "text": {"type": "plain_text", "text": f"🚨 Human Approval Required: {incident_id}"}
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Proposed Action:* {plan_details['title']}\n*Impact:* {plan_details.get('projected_latency_drop', 'N/A')}\n*FinOps Savings:* {plan_details.get('finops_savings', 'N/A')}"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "✅ Approve & Deploy Fix"},
                        "style": "primary",
                        "value": f"approve_{incident_id}"
                    },
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "❌ Reject Plan"},
                        "style": "danger",
                        "value": f"reject_{incident_id}"
                    }
                ]
            }
        ]
    }

    return jsonify({
        "success": True,
        "message": "Plan submitted successfully. Notification dispatched to Slack.",
        "slack_message_blocks": slack_blocks,
        "gate": _GATE_STATE
    }), 200

@slack_gate_bp.route("/slack/action/approve", methods=["POST"])
def approve_action():
    """Triggers human approval to unblock remediation and deployment."""
    payload = request.get_json(silent=True) or {}
    approver = payload.get("approver", "Principal SRE (Human-in-the-Loop)")
    notes = payload.get("notes", "Verified sandbox benchmark results. Approved for production deploy.")

    _GATE_STATE["status"] = "APPROVED"
    _GATE_STATE["approver"] = approver
    _GATE_STATE["approved_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    event = {
        "timestamp": _GATE_STATE["approved_at"],
        "action": "PLAN_APPROVED",
        "actor": approver,
        "details": notes
    }
    _GATE_STATE["audit_trail"].append(event)
    logger.info(f"Remediation plan for {_GATE_STATE['incident_id']} APPROVED by {approver}")

    return jsonify({
        "success": True,
        "message": f"Remediation for {_GATE_STATE['incident_id']} approved successfully.",
        "gate": _GATE_STATE
    }), 200

@slack_gate_bp.route("/slack/action/reject", methods=["POST"])
def reject_action():
    """Human rejection of the proposed plan."""
    payload = request.get_json(silent=True) or {}
    approver = payload.get("approver", "Principal SRE")
    reason = payload.get("reason", "Requires further canary observation.")

    _GATE_STATE["status"] = "REJECTED"
    _GATE_STATE["approver"] = approver

    event = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "action": "PLAN_REJECTED",
        "actor": approver,
        "details": reason
    }
    _GATE_STATE["audit_trail"].append(event)
    logger.warning(f"Plan for {_GATE_STATE['incident_id']} REJECTED: {reason}")

    return jsonify({
        "success": True,
        "message": f"Plan for {_GATE_STATE['incident_id']} rejected.",
        "gate": _GATE_STATE
    }), 200

@slack_gate_bp.route("/slack/action/reset", methods=["POST", "GET", "OPTIONS"])
def reset_action():
    """Human or system reset of the gate state to IDLE."""
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    _GATE_STATE["status"] = "IDLE"
    _GATE_STATE["approver"] = None
    _GATE_STATE["approved_at"] = None
    event = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "action": "GATE_RESET",
        "actor": "System / Page Refresh",
        "details": "Approval gate reset to IDLE"
    }
    _GATE_STATE["audit_trail"].append(event)
    return jsonify({
        "success": True,
        "message": "Gate reset to IDLE",
        "gate": _GATE_STATE
    }), 200

def create_gate_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({
            "service": "TelemetryPulse Slack Approval Gate",
            "status": "HEALTHY",
            "gate_state": _GATE_STATE["status"]
        }), 200

    app.register_blueprint(slack_gate_bp)
    return app

if __name__ == "__main__":
    app = create_gate_app()
    port = int(os.getenv("SLACK_GATE_PORT", 5001))
    logger.info(f"Starting TelemetryPulse Slack Approval Gate on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
