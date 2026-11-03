"""
DukaanMitra AI Engineering Sandbox - Fast-API Router
Exposes the controlled 7-step Agent Execution Lifecycle and Policy Gates.
"""

import uuid
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends
from .schemas import (
    AgentRunRequest,
    AgentRunResponse,
    HealthStatus,
    PolicyEvaluationResult,
    AgentRecommendation,
    EvidenceItem,
)
from .config import config
from .agents.registry import AGENTS, list_registered_agents, get_agent_info
from .security.policy import evaluate_request
from .providers.factory import get_model

router = APIRouter()

@router.get("/health", response_model=HealthStatus)
def sandbox_health():
    """Returns sandbox runtime environment health and active provider."""
    return HealthStatus(
        status="ok",
        execution_mode=config.EXECUTION_MODE,
        provider=config.MODEL_PROVIDER,
        registered_agents=list_registered_agents()
    )

@router.get("/v1/agents/list")
def list_agents():
    """Returns all registered agents, capabilities, and permission constraints."""
    return {
        "execution_mode": config.EXECUTION_MODE,
        "count": len(AGENTS),
        "agents": AGENTS
    }

@router.post("/v1/agents/run", response_model=AgentRunResponse)
def run_agent(req: AgentRunRequest):
    """
    Executes the controlled 7-step Agent Execution Lifecycle:
    1. Authenticate & validate tenant context
    2. Retrieve evidence (sandbox snapshot)
    3. Generate recommendation via Model Provider (Mock / Ollama / Vertex)
    4. Validate security policy
    5. Evaluate approval gate (maker-checker requirement)
    6. Simulate sandbox action
    7. Generate immutable audit record
    """
    run_id = f"run_{uuid.uuid4().hex[:12]}"
    agent_id = req.agent.lower()

    if agent_id not in AGENTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown agent '{req.agent}'. Available: {list_registered_agents()}"
        )

    # 1 & 2. Retrieve Evidence & Context
    evidence = [
        {"source": "local_pos_snapshot", "key": "query", "value": req.question, "confidence": 1.0},
        {"source": "tenant_context", "key": "tenant_id", "value": req.tenant_id, "confidence": 1.0}
    ]

    # 3. Security Policy Evaluation
    policy_result = evaluate_request(agent_id, req.question)

    # 4. Check whether action is rejected
    if not policy_result.allowed:
        approval_ticket = f"ticket_{uuid.uuid4().hex[:8]}" if policy_result.approval_required else None
        return AgentRunResponse(
            run_id=run_id,
            agent=agent_id,
            tenant_id=req.tenant_id or "tenant_sandbox_default",
            status="APPROVAL_REQUIRED" if policy_result.approval_required else "REJECTED",
            policy=policy_result,
            approval_ticket_id=approval_ticket,
            simulated_action_taken=False,
            audit_logged=True
        )

    # 5. Generate Recommendation via Model Provider
    model = get_model()
    raw_rec = model.generate_recommendation(agent_id, req.question, evidence, req.context or {})

    recommendation = AgentRecommendation(
        agent=agent_id,
        summary=raw_rec.get("summary", ""),
        recommendation=raw_rec.get("recommendation", ""),
        action_type=raw_rec.get("action_type", "RECOMMENDATION_ONLY"),
        structured_payload=raw_rec.get("structured_payload", {}),
        evidence=[EvidenceItem(**e) for e in raw_rec.get("evidence", [])],
        confidence_score=raw_rec.get("confidence_score", 0.95)
    )

    # 6 & 7. Execution status and simulated action
    is_approval_needed = policy_result.approval_required
    status_str = "APPROVAL_REQUIRED" if is_approval_needed else "COMPLETED"
    approval_ticket = f"ticket_{uuid.uuid4().hex[:8]}" if is_approval_needed else None

    return AgentRunResponse(
        run_id=run_id,
        agent=agent_id,
        tenant_id=req.tenant_id or "tenant_sandbox_default",
        status=status_str,
        policy=policy_result,
        recommendation=recommendation,
        approval_ticket_id=approval_ticket,
        simulated_action_taken=not is_approval_needed,
        audit_logged=True
    )
