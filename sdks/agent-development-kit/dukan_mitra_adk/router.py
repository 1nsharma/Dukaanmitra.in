"""
DukaanMitra Agent Development Kit (ADK) — Omnichannel Router Agent
Intercepts incoming triggers from WhatsApp (OpenWA / Meta), Google My Business (GMB),
Web Console, or Voice Notes and routes to the appropriate specialist agent.
"""

import re
from typing import Dict, Any

class AgentRouter:
    """Classifies natural language intent and dispatches to specialized agent."""

    @staticmethod
    def classify_intent(text: str) -> str:
        low = text.lower().strip()

        # Check inventory first if explicit stock words exist
        if any(re.search(rf"\b{re.escape(w)}\b", low) for w in ["stock", "maal", "khatam", "bacha", "reorder", "inventory", "godown"]):
            return "inventory"

        # Accounting / Khata / Udhaar
        if any(re.search(rf"\b{re.escape(w)}\b", low) for w in ["udhaar", "khata", "jama", "baaki", "hisab", "payment", "ledger"]):
            return "accounting"

        # Marketing / Offers / GMB / WhatsApp
        if any(re.search(rf"\b{re.escape(w)}\b", low) for w in ["offer", "discount", "grahak", "broadcast", "review", "gmb", "promotion"]):
            return "marketing"

        # General order / Cart
        if any(re.search(rf"\b{re.escape(w)}\b", low) for w in ["order", "chahiye", "bhejo", "pack", "deliver"]):
            return "commerce"

        return "general_inquiry"
