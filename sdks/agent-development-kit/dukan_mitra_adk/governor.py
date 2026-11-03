"""
DukaanMitra Agent Development Kit (ADK) — Sandbox Governor & Security Engine
Enforces:
- Financial transaction spending limits
- Prohibits uncontrolled state modifications without merchant authorization
- Intercepts unsafe actions before execution
"""

from typing import Dict, Any, Tuple
from .base_agent import GovernorAlert

class SandboxGovernor:
    """Evaluates proposed agent tool executions against shop security policy."""

    @staticmethod
    def inspect_action(tenant_id: str, tool_name: str, args: Dict[str, Any], max_auto_spend: float = 1000.0) -> Tuple[bool, str]:
        # 1. Financial check
        amount = float(args.get("amount", 0.0))
        if amount > max_auto_spend:
            return False, f"Amount ₹{amount} exceeds automated safety threshold of ₹{max_auto_spend}. Requires human approval."

        # 2. Destructive SQL / Database check
        query = str(args.get("query", "")).lower()
        if any(w in query for w in ["drop table", "truncate", "delete from", "alter table"]):
            raise GovernorAlert("Arbitrary destructive database modification blocked.", code="UNSAFE_DB_WRITE")

        # 3. Mass broadcast check
        recipient_count = len(args.get("recipients", []))
        if recipient_count > 100:
            return False, f"Mass broadcast of {recipient_count} recipients requires merchant confirmation."

        return True, "ACTION_APPROVED"
