"""
DukaanMitra AI Engineering Sandbox - Specialized Agent Registry
Defines roles, responsibilities, capabilities, and permission constraints for the 6 core agents.
"""

from typing import Dict, Any, List

AGENTS: Dict[str, Dict[str, Any]] = {
    "inventory": {
        "name": "Inventory Intelligence Agent",
        "role": "Analyze stock availability, identify slow-moving items, and generate replenishment signals.",
        "allowed_permissions": ["READ_INVENTORY", "RECOMMEND_RESTOCK"],
        "write_permission": "APPROVAL_REQUIRED",
        "tools": ["query_stock_levels", "calculate_reorder_point", "flag_dead_stock"]
    },
    "procurement": {
        "name": "Procurement & Supplier Agent",
        "role": "Compare FMCG suppliers, benchmark wholesale prices, and draft purchase orders.",
        "allowed_permissions": ["READ_SUPPLIERS", "COMPARE_QUOTES"],
        "write_permission": "APPROVAL_REQUIRED",
        "tools": ["query_supplier_catalog", "calculate_margin_spread", "draft_purchase_order"]
    },
    "pricing": {
        "name": "Dynamic Pricing & Margin Agent",
        "role": "Analyze product margins, wholesale purchase costs, and competitive price scenarios.",
        "allowed_permissions": ["READ_SALES", "CALCULATE_MARGINS"],
        "write_permission": "APPROVAL_REQUIRED",
        "tools": ["simulate_margin_impact", "benchmark_mandi_rates", "recommend_price_change"]
    },
    "marketing": {
        "name": "Marketing & Customer Engagement Agent",
        "role": "Segment customer clusters, draft WhatsApp promotional flyers, and design festival campaigns.",
        "allowed_permissions": ["READ_CUSTOMER_SEGMENTS", "DRAFT_MESSAGES"],
        "write_permission": "DRAFT_ONLY",
        "tools": ["segment_repeat_buyers", "draft_whatsapp_campaign", "create_loyalty_coupon"]
    },
    "shopping": {
        "name": "Customer Shopping & Discovery Agent",
        "role": "Help customers discover store products, find alternatives, and simulate shopping cart checkout.",
        "allowed_permissions": ["READ_CATALOG", "BUILD_CART_SIMULATION"],
        "write_permission": "CART_SIMULATION_ONLY",
        "tools": ["search_catalog_by_intent", "check_product_availability", "estimate_cart_total"]
    },
    "credit_recovery": {
        "name": "Credit Recovery & Udhaar Agent",
        "role": "Analyze outstanding customer accounts receivables and draft respectful WhatsApp payment reminders.",
        "allowed_permissions": ["READ_UDHAAR_LEDGER", "DRAFT_REMINDERS"],
        "write_permission": "DRAFT_ONLY",
        "tools": ["query_outstanding_receivables", "calculate_aging_buckets", "generate_courteous_reminder"]
    }
}

def list_registered_agents() -> List[str]:
    return list(AGENTS.keys())

def get_agent_info(agent_id: str) -> Dict[str, Any]:
    if agent_id not in AGENTS:
        raise ValueError(f"Agent '{agent_id}' is not registered. Available: {list_registered_agents()}")
    return AGENTS[agent_id]
