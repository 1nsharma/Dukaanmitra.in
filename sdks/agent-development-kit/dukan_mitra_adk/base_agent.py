"""
DukaanMitra Agent Development Kit (ADK) — Base Agent Abstraction
Provides secure primitives for creating autonomous retail agents with sandbox governance,
context memory, and tool-binding.
"""

from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod
import json
import uuid
import datetime

class GovernorAlert(Exception):
    """Raised when an agent attempts an action breaching sandbox policy."""
    def __init__(self, message: str, code: str = "POLICY_VIOLATION", action: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.action = action or {}

class SandboxTool:
    """Safe tool primitive with explicit permission declarations and execution guardrails."""
    def __init__(self, name: str, description: str, requires_approval: bool = False, spending_limit: float = 0.0):
        self.name = name
        self.description = description
        self.requires_approval = requires_approval
        self.spending_limit = spending_limit

    def execute(self, **kwargs) -> Any:
        raise NotImplementedError

class BaseAgent(ABC):
    """
    Abstract base class for all DukaanMitra specialized agents.
    Enforces Observe-Plan-Review-Execute lifecycle inside isolated runtimes.
    """
    execution_profile: str = "isolated-sandbox-strict"

    def __init__(self, agent_id: str, name: str, role: str, tenant_id: str):
        self.agent_id = agent_id or f"agt_{uuid.uuid4().hex[:8]}"
        self.name = name
        self.role = role
        self.tenant_id = tenant_id
        self.tools: Dict[str, SandboxTool] = {}
        self._memory_log: List[Dict[str, Any]] = []

    def register_tool(self, tool: SandboxTool):
        self.tools[tool.name] = tool

    def log_thought(self, thought: str):
        self._memory_log.append({
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "agent": self.name,
            "thought": thought
        })

    @abstractmethod
    async def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Core execution cycle for domain logic."""
        pass

    def on_violation(self, alert: GovernorAlert):
        """Self-destruct or safety fallback when governor policy is breached."""
        self.log_thought(f"SAFETY ABORT: {alert.message}")
        return {
            "status": "HALTED_BY_GOVERNOR",
            "reason": alert.message,
            "action": alert.action
        }
