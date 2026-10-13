# Mowglai — Client Acceptance & Handover Pack

**Project:** AI-Assisted Website Delivery  
**Workflow Engine:** Mowglai Website Delivery Agent v0.1  
**Target Delivery:** 3-Day Turnaround

---

## 1. Client Intake Brief Template

```yaml
project_id: "mowglai_demo_kirana_01"
client_name: "Gupta General Stores"
business_type: "Retail Kirana & Daily Essentials"
contact_person: "Ramesh Gupta"
phone: "+91 98765 43210"
email: "guptastores@example.com"
brand_theme:
  primary_color: "#16a34a"  # Emerald Green
  accent_color: "#ea580c"   # Vibrant Tangerine
  font_family: "Inter, sans-serif"
target_pages:
  - id: "home"
    title: "Home"
    focus: "Hero banner, today's deals, free delivery radius"
  - id: "products"
    title: "Catalog / Services"
    focus: "Category listing (Atta, Rice, Spices, Dairy, Daily Staples)"
  - id: "about"
    title: "About Us"
    focus: "30-year heritage serving the neighborhood with genuine products"
  - id: "contact"
    title: "Contact & Order"
    focus: "WhatsApp quick-order button, shop address on Google Maps, contact form"
domain_preference: "guptastores.dukaanmitra.in"
acceptance_criteria:
  - "Mobile-friendly responsive display on iOS and Android"
  - "1-click WhatsApp order button pre-filled with cart request"
  - "Fast loading speed (<1.5s on 4G networks)"
  - "Verified SSL certificate and clear store contact info"
```

---

## 2. Automated QA Verification Checklist

| QA Item | Test Criteria | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Responsive Viewport** | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | PASS | Tested 360px (mobile) to 1440px (desktop) |
| **Broken Link Check** | All internal `href` attributes map to valid page sections | PASS | 0 broken anchors detected |
| **Interactive Order Form** | Input validation on phone number and item list | PASS | Client-side HTML5 constraints applied |
| **SEO Meta Tags** | Title (<60 chars), Description (<160 chars), OpenGraph tags | PASS | Schema.org LocalBusiness JSON-LD injected |
| **Accessibility (a11y)** | High contrast color palette (WCAG AA ratio > 4.5:1), image `alt` tags | PASS | Accessible button roles and landmarks present |

---

## 3. Client Sign-off Certificate

```text
================================================================================
                    MOWGLAI WEBSITE DELIVERY ACCEPTANCE
================================================================================
Client Name:      Gupta General Stores
Representative:   Ramesh Gupta
Preview URL:      http://localhost:8000/api/v1/mowglai/preview/mowglai_demo_kirana_01
Staging Domain:   guptastores.dukaanmitra.in
Delivery Date:    13 October 2026

Sign-off Statement:
"I hereby confirm that I have reviewed the generated website preview, tested the
mobile layout, verified the WhatsApp ordering integration, and approve the
release for public production deployment."

Client Signature: _______________________      Date: ______________
Mowglai Engineer: _______________________      Date: 13-10-2026
================================================================================
```
