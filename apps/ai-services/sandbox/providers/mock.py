"""
DukaanMitra AI Engineering Sandbox - Deterministic Mock AI Provider
Provides predictable, zero-latency, zero-cost responses for local sandbox evaluations and tests.
"""

from typing import Dict, Any, List
from .base import BaseAIModel

class MockModel(BaseAIModel):
    def generate(self, prompt: str, system_instruction: str = "") -> str:
        return f"[MOCK_MODEL_RESPONSE] Processed query: '{prompt}' under sandbox guidelines."

    def generate_recommendation(
        self,
        agent: str,
        question: str,
        evidence: List[Dict[str, Any]],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Returns structured, grounded recommendation based on agent type."""
        
        agent_templates = {
            "inventory": {
                "summary": "Detected 3 slow-moving SKUs with >45 days of supply in store inventory.",
                "recommendation": "Initiate bundle discount for 'Fortune Mustard Oil 1L' with 'Aashirvaad Atta 5kg' to liquidate capital before upcoming festive restocking.",
                "action_type": "DRAFT_BUNDLE_PROPOSAL",
                "structured_payload": {"skus": ["SKU_FORT_1L", "SKU_AASH_5KG"], "suggested_discount_pct": 8}
            },
            "procurement": {
                "summary": "Supplier Mandi quotes analyzed: FMCG Distributor B offers ₹14/unit vs Distributor A at ₹16/unit for Maggi 2-Min Noodles.",
                "recommendation": "Draft Purchase Order with Distributor B for 10 cartons (Savings: ₹480). Human approval required to execute PO.",
                "action_type": "DRAFT_PURCHASE_ORDER",
                "structured_payload": {"supplier_id": "SUPP_FMCG_B", "items": [{"sku": "MAGGI_70G", "qty": 240, "price": 14}]}
            },
            "pricing": {
                "summary": "Current margin on Tata Salt 1kg is 14.2% against localized benchmark of 18%.",
                "recommendation": "Recommend increasing selling price by ₹1 (from ₹27 to ₹28) to normalize retail margin without losing price competitiveness.",
                "action_type": "RECOMMEND_PRICE_ADJUSTMENT",
                "structured_payload": {"sku": "TATA_SALT_1KG", "current_mrp": 27, "recommended_mrp": 28}
            },
            "marketing": {
                "summary": "142 repeat customers haven't visited in the last 21 days.",
                "recommendation": "Draft personalized WhatsApp re-engagement offer: 'Special weekend grocery discount - 5% off on bills above ₹1,000'.",
                "action_type": "DRAFT_WHATSAPP_CAMPAIGN",
                "structured_payload": {"target_audience_count": 142, "offer_code": "MITRA5"}
            },
            "shopping": {
                "summary": "Customer queried for 'Atta, Doodh, aur refined oil'.",
                "recommendation": "Matched with in-stock products: Aashirvaad Atta 5kg (₹240), Amul Taza 500ml (₹27), Fortune Oil 1L (₹145). Total estimated cart: ₹412.",
                "action_type": "SIMULATED_CART",
                "structured_payload": {"estimated_total": 412, "matched_items_count": 3}
            },
            "credit_recovery": {
                "summary": "Identified 8 accounts with Udhaar pending for >30 days totaling ₹4,850.",
                "recommendation": "Draft respectful reminder with UPI 1-tap deep link for customer 'Ramesh Kumar' (Pending: ₹650 for 34 days).",
                "action_type": "DRAFT_PAYMENT_REMINDER",
                "structured_payload": {"customer_name": "Ramesh Kumar", "outstanding": 650, "days_overdue": 34}
            }
        }

        template = agent_templates.get(agent, {
            "summary": f"Processed sandbox evaluation for agent: {agent}.",
            "recommendation": f"Simulated business recommendation for: '{question}'.",
            "action_type": "GENERAL_ADVICE",
            "structured_payload": {}
        })

        return {
            "agent": agent,
            "summary": template["summary"],
            "recommendation": template["recommendation"],
            "action_type": template["action_type"],
            "structured_payload": template["structured_payload"],
            "evidence": [
                {"source": "local_pos_snapshot", "key": "query_input", "value": question, "confidence": 1.0},
                {"source": "retail_benchmark", "key": "model_provider", "value": "mock_sandbox", "confidence": 1.0}
            ],
            "confidence_score": 0.98
        }
