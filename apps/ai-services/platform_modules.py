"""
DukaanMitra Platform Ecosystem Modules
Ports and consolidates core capabilities from all ecosystem repositories:
1. AI Studio & Creator Tools (portofolio, Gallaryai, Synapse)
2. Business Growth & Automation / CRM (HireSaathi, Amit-Corporate)
3. QR, Customer Feedback & Local Reviews (AI-QR / Qrie)
4. Specialized Business Verticals (Petsjanu, Tulika Salon, Kanha Construction)
5. Safety, CallGuard & Business Intelligence (Power-BI-AI-Guru, AmitAI-CallGuard, Sentinel)
"""
import json, uuid, re
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

# ==============================================================================
# 1. AI STUDIO & CREATOR TOOLS
# ==============================================================================
class AIStudioService:
    @staticmethod
    def generate_product_marketing(product_name: str, category: str, price: float, language: str = "hinglish") -> Dict[str, str]:
        """Generates punchy, localized marketing copy for WhatsApp status and social channels."""
        if language == "hinglish":
            caption = (
                f"Ab apki apni dukan par uplabdh: {product_name} sirf ₹{price:g} mein! "
                f"Shuddh aur taaza maal, turant dukan par aayein ya WhatsApp par order karein. #VocalForLocal"
            )
            banner_prompt = (
                f"High-quality commercial product photograph of {product_name}, clean retail packaging, "
                f"vibrant Indian grocery background, festive warm lighting, professional studio banner."
            )
        else:
            caption = (
                f"Special Offer at your trusted local store: Get {product_name} for just ₹{price:g}! "
                f"Fresh stock available now. Visit us or order directly on WhatsApp."
            )
            banner_prompt = (
                f"High resolution product shot of {product_name}, studio lighting, clear label, modern retail setting."
            )

        return {
            "product_name": product_name,
            "category": category,
            "price": price,
            "whatsapp_caption": caption,
            "banner_image_prompt": banner_prompt
        }

# ==============================================================================
# 2. BUSINESS GROWTH & AUTOMATION / CRM (HireSaathi & Corporate CRM)
# ==============================================================================
class GrowthCrmService:
    @staticmethod
    def build_retention_campaign(customer_name: str, days_inactive: int, discount_pct: int = 5) -> Dict[str, Any]:
        """Drafts personalized re-engagement WhatsApp message for inactive store patrons."""
        message = (
            f"Namaste {customer_name} ji! DukaanMitra par humne aapko miss kiya. "
            f"Agli khareedari par paaiye vishesh {discount_pct}% ki chhoot! "
            f"Aaj hi hamari dukan visit karein ya WhatsApp par bill mangwayein."
        )
        return {
            "customer_name": customer_name,
            "days_inactive": days_inactive,
            "discount_pct": discount_pct,
            "draft_message": message,
            "campaign_status": "draft"
        }

# ==============================================================================
# 3. QR, CUSTOMER FEEDBACK & REPUTATION (AI-QR / Qrie)
# ==============================================================================
class QrReputationService:
    @staticmethod
    def generate_upi_qr_payload(vpa: str, payee_name: str, amount: Optional[float] = None, note: str = "DukaanMitra Payment") -> str:
        """Standard NPCI UPI intent link format."""
        clean_vpa = vpa.strip()
        clean_name = payee_name.replace(" ", "%20")
        clean_note = note.replace(" ", "%20")
        link = f"upi://pay?pa={clean_vpa}&pn={clean_name}&tn={clean_note}&cu=INR"
        if amount and amount > 0:
            link += f"&am={amount:.2f}"
        return link

    @staticmethod
    def route_feedback(rating: int, comment: str, google_review_url: str = "https://g.page/r/example/review") -> Dict[str, Any]:
        """
        Smart feedback routing:
        Ratings >= 4 are directed to public Google Reviews to boost local SEO.
        Ratings <= 3 are routed privately to store owner grievance log.
        """
        if rating >= 4:
            return {
                "route": "google_reviews",
                "action": "public_invite",
                "target_url": google_review_url,
                "message": "Thank you for the 5-star love! Please consider leaving a review on Google:",
                "sentiment": "positive"
            }
        else:
            return {
                "route": "private_grievance",
                "action": "owner_alert",
                "message": "We apologize for the inconvenience. Your feedback has been sent directly to the store owner for swift resolution.",
                "comment": comment,
                "sentiment": "negative_or_neutral"
            }

# ==============================================================================
# 4. SPECIALIZED BUSINESS VERTICALS (Pets, Salon, Construction)
# ==============================================================================
class VerticalsService:
    # 4A. Salon & Studio Appointments (Tulika Saloon)
    @staticmethod
    def calculate_salon_bill(services: List[Dict[str, Any]], discount_pct: float = 0.0) -> Dict[str, Any]:
        subtotal = sum(s.get("price", 0.0) for s in services)
        total_duration_minutes = sum(s.get("duration_minutes", 30) for s in services)
        discount = round(subtotal * (discount_pct / 100.0), 2)
        final_total = round(subtotal - discount, 2)
        return {
            "services_count": len(services),
            "total_duration_minutes": total_duration_minutes,
            "subtotal": subtotal,
            "discount": discount,
            "final_total": final_total
        }

    # 4B. Pet Profile & Lost Pet QR (Petsjanu / Pets-)
    @staticmethod
    def generate_pet_tag_payload(pet_name: str, breed: str, owner_phone: str, microchip_id: Optional[str] = None) -> Dict[str, Any]:
        return {
            "tag_id": f"PET_{uuid.uuid4().hex[:8].upper()}",
            "pet_name": pet_name,
            "breed": breed,
            "emergency_contact": owner_phone,
            "microchip_id": microchip_id or "N/A",
            "qr_action_url": f"https://dukaanmitra.in/pet-safety/scan?phone={owner_phone}&name={pet_name}"
        }

    # 4C. Construction & Contractor Estimates (Kanha Construction)
    @staticmethod
    def estimate_civil_work(area_sqft: float, rate_per_sqft: float, include_material: bool = True) -> Dict[str, Any]:
        base_cost = area_sqft * rate_per_sqft
        # Material breakdown rule of thumb: 60% Material, 40% Labor
        material_cost = round(base_cost * 0.60, 2) if include_material else 0.0
        labor_cost = round(base_cost * 0.40, 2) if include_material else base_cost
        gst_amount = round((material_cost + labor_cost) * 0.18, 2) # Standard 18% GST on Works Contract
        grand_total = round(material_cost + labor_cost + gst_amount, 2)

        return {
            "area_sqft": area_sqft,
            "rate_per_sqft": rate_per_sqft,
            "material_cost": material_cost,
            "labor_cost": labor_cost,
            "gst_18pct": gst_amount,
            "estimated_grand_total": grand_total
        }

# ==============================================================================
# 5. SAFETY, CALLGUARD & BUSINESS INTELLIGENCE (CallGuard & PowerBI Guru)
# ==============================================================================
class SafetyAnalyticsService:
    KNOWN_SCAM_PATTERNS = [
        r"lottery", r"congratulations.*won", r"share\s+otp", r"anydesk", r"teamviewer", r"kyc\s+blocked"
    ]

    @classmethod
    def check_call_or_message_safety(cls, text: str, sender_phone: Optional[str] = None) -> Dict[str, Any]:
        low = text.lower()
        threats = []
        for pat in cls.KNOWN_SCAM_PATTERNS:
            if re.search(pat, low):
                threats.append(pat)

        is_suspicious = len(threats) > 0
        return {
            "is_safe": not is_suspicious,
            "threat_level": "CRITICAL_SCAM" if is_suspicious else "SAFE",
            "detected_threats": threats,
            "recommendation": "DO NOT SHARE OTP OR INSTALL REMOTE APPS" if is_suspicious else "No known scam markers found."
        }

# ==============================================================================
# FASTAPI ROUTE REGISTRATION FOR ECOSYSTEM PLATFORM MODULES
# ==============================================================================
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

class MarketingReq(BaseModel):
    product_name: str
    category: str = "general"
    price: float
    language: str = "hinglish"

class CrmRetentionReq(BaseModel):
    customer_name: str
    days_inactive: int
    discount_pct: int = 5

class FeedbackRouteReq(BaseModel):
    rating: int
    comment: str = ""
    google_review_url: str = "https://g.page/r/example/review"

class SafetyCheckReq(BaseModel):
    text: str
    sender_phone: Optional[str] = None

class SalonEstimateReq(BaseModel):
    services: List[Dict[str, Any]]
    discount_pct: float = 0.0

class ConstructionEstimateReq(BaseModel):
    area_sqft: float
    rate_per_sqft: float
    include_material: bool = True

class PetTagReq(BaseModel):
    pet_name: str
    breed: str
    owner_phone: str
    microchip_id: Optional[str] = None

def register_platform_routes(app: FastAPI):
    @app.post("/api/v1/modules/marketing/generate")
    def api_marketing(req: MarketingReq):
        return AIStudioService.generate_product_marketing(req.product_name, req.category, req.price, req.language)

    @app.post("/api/v1/modules/crm/retention-draft")
    def api_crm_retention(req: CrmRetentionReq):
        return GrowthCrmService.build_retention_campaign(req.customer_name, req.days_inactive, req.discount_pct)

    @app.post("/api/v1/modules/feedback/route")
    def api_feedback_route(req: FeedbackRouteReq):
        return QrReputationService.route_feedback(req.rating, req.comment, req.google_review_url)

    @app.post("/api/v1/modules/safety/call-check")
    def api_safety_check(req: SafetyCheckReq):
        return SafetyAnalyticsService.check_call_or_message_safety(req.text, req.sender_phone)

    @app.post("/api/v1/modules/verticals/salon-estimate")
    def api_salon_estimate(req: SalonEstimateReq):
        return VerticalsService.calculate_salon_bill(req.services, req.discount_pct)

    @app.post("/api/v1/modules/verticals/construction-estimate")
    def api_construction_estimate(req: ConstructionEstimateReq):
        return VerticalsService.estimate_civil_work(req.area_sqft, req.rate_per_sqft, req.include_material)

    @app.post("/api/v1/modules/verticals/pet-tag")
    def api_pet_tag(req: PetTagReq):
        return VerticalsService.generate_pet_tag_payload(req.pet_name, req.breed, req.owner_phone, req.microchip_id)
