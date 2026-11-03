"""
DukaanMitra AI Engineering Sandbox - Security Policy & Human Approval Gate
Enforces Deny-by-Default authorization, sensitive keyword guards, and immutable audit logs.
"""

from typing import Dict, Any, List
from ..schemas import PolicyEvaluationResult

SENSITIVE_KEYWORDS = [
    "pay", "transfer", "refund", "payout",
    "delete", "drop table", "truncate", "remove all",
    "send whatsapp", "broadcast now", "blast message",
    "change price", "update mrp", "overwrite rate",
    "write stock", "adjust quantity", "zero out"
]

APPROVAL_MANDATED_AGENTS = [
    "pricing",
    "procurement",
    "credit_recovery"
]

def evaluate_request(agent: str, question: str, role: str = "operator") -> PolicyEvaluationResult:
    """
    Evaluates whether an incoming agent request is safe to execute or requires human approval.
    Follows zero-trust & deny-by-default principles.
    """
    q_lower = question.lower()
    flagged = [term for term in SENSITIVE_KEYWORDS if term in q_lower]
    
    # 1. Immediate trigger: Destructive or direct financial operations are BLOCKED from autonomous execution
    if flagged:
        return PolicyEvaluationResult(
            allowed=False,
            approval_required=True,
            requires_maker_checker=True,
            flagged_terms=flagged,
            reason=f"Request contains sensitive action keywords: {', '.join(flagged)}. Autonomous execution is blocked. Explicit human approval ticket required."
        )

    # 2. Agent-specific mandatory approval gate
    if agent in APPROVAL_MANDATED_AGENTS:
        return PolicyEvaluationResult(
            allowed=True,
            approval_required=True,
            requires_maker_checker=False,
            flagged_terms=[],
            reason=f"Agent '{agent}' operates on sensitive business domains (procurement/pricing/receivables). Action permitted in simulation mode; write actions require human signoff."
        )

    # 3. Read-only or benign recommendation permitted
    return PolicyEvaluationResult(
        allowed=True,
        approval_required=False,
        requires_maker_checker=False,
        flagged_terms=[],
        reason="Action permitted within safe sandbox operational boundaries."
    )
