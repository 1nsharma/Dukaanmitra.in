"""
DukaanMitra AI Engineering Sandbox - Pydantic Data Contracts & Schemas
Enforces strict typing, schema validation, and audit readiness for all agent interactions.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class AgentRunRequest(BaseModel):
    agent: str = Field(..., description="Target agent identifier: inventory, procurement, pricing, marketing, shopping, credit_recovery")
    question: str = Field(..., description="User query or business problem to solve")
    tenant_id: Optional[str] = Field("tenant_sandbox_default", description="Multi-tenant shop identifier")
    user_id: Optional[str] = Field("user_sandbox_operator", description="Authenticated user initiating request")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional tenant or runtime context")

class PolicyEvaluationResult(BaseModel):
    allowed: bool
    approval_required: bool
    requires_maker_checker: bool = False
    flagged_terms: List[str] = []
    reason: str

class EvidenceItem(BaseModel):
    source: str
    key: str
    value: Any
    confidence: float = 1.0

class AgentRecommendation(BaseModel):
    agent: str
    summary: str
    recommendation: str
    action_type: str = "RECOMMENDATION_ONLY"
    structured_payload: Dict[str, Any] = Field(default_factory=dict)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    confidence_score: float = 0.95

class AgentRunResponse(BaseModel):
    run_id: str
    agent: str
    tenant_id: str
    status: str  # "COMPLETED", "APPROVAL_REQUIRED", "REJECTED"
    policy: PolicyEvaluationResult
    recommendation: Optional[AgentRecommendation] = None
    approval_ticket_id: Optional[str] = None
    simulated_action_taken: bool = False
    audit_logged: bool = True
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class HealthStatus(BaseModel):
    status: str
    execution_mode: str
    provider: str
    registered_agents: List[str]
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
