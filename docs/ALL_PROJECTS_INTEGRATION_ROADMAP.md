# DukaanMitra — All-Projects Feature Integration Roadmap
Centralized Retail & MSME Operating System

This roadmap formalizes the strategy to consolidate the capabilities of Amit Sharma’s ecosystem repositories into DukaanMitra as modular services under a shared AI Brain and unified security model.

---

## 1. Domain Modules Ported into DukaanMitra

### Module 1: AI Studio & Creator Tools
- **Source Repositories**: `portofolio`, `Gallaryai`, `Synapse`
- **Ported Capabilities**:
  - Multilingual product marketing copy generator (Hinglish/English).
  - Social media & WhatsApp status captions.
  - Generative AI banner prompts for seasonal festivals and store promotions.
  - Safe sandboxed AI playgrounds without arbitrary system access.
- **Service**: `AIStudioService` (`platform_modules.py`)
- **Endpoint**: `POST /api/v1/modules/marketing/generate`

### Module 2: Business Growth & Automation / CRM
- **Source Repositories**: `HireSaathi`, `Amit-Corporate`
- **Ported Capabilities**:
  - Inactive customer retention engine (30+ days inactive detection).
  - Automated WhatsApp re-engagement draft broadcaster.
  - Candidate and staff onboarding workflows.
- **Service**: `GrowthCrmService` (`platform_modules.py`)
- **Endpoint**: `POST /api/v1/modules/crm/retention-draft`

### Module 3: QR, Customer Feedback & Local Reviews
- **Source Repositories**: `AI-QR` / `Qrie`
- **Ported Capabilities**:
  - Dynamic NPCI UPI QR intent link generator.
  - Smart customer review routing:
    - 4-5 stars: Directed to Google Maps / Local SEO review page.
    - 1-3 stars: Routed privately to merchant grievance log.
- **Service**: `QrReputationService` (`platform_modules.py`)
- **Endpoint**: `POST /api/v1/modules/feedback/route`

### Module 4: Specialized Vertical Micro-Modules
- **Source Repositories**: `Tulika-Saloon-Studio`, `Pets-`, `Petsjanu.com`, `Kanha-Construction-Interiors`
- **Ported Capabilities**:
  - **Salon**: Multi-service duration & bill calculator with stylist commission splits.
  - **Pet Care**: Emergency contact QR tag generator, microchip ID & breed record.
  - **Construction**: Civil works estimate engine (Area sq ft -> Material 60% + Labor 40% + 18% Works GST).
- **Service**: `VerticalsService` (`platform_modules.py`)
- **Endpoints**:
  - `POST /api/v1/modules/verticals/salon-estimate`
  - `POST /api/v1/modules/verticals/construction-estimate`
  - `POST /api/v1/modules/verticals/pet-tag`

### Module 5: Fraud Shield, CallGuard & Intelligence
- **Source Repositories**: `Power-BI-AI-Guru`, `AmitAI-CallGuard`, `sentinel-protocol`
- **Ported Capabilities**:
  - Real-time spam / scam phone number detection.
  - Social engineering & OTP theft pattern interception.
  - Automated P&L summary and dead inventory alert reports.
- **Service**: `SafetyAnalyticsService` (`platform_modules.py`)
- **Endpoint**: `POST /api/v1/modules/safety/call-check`

---

## 2. IP & Licensing Governance
- Standard open repositories are refactored cleanly into Python/TypeScript modules rather than copied blindly.
- Proprietary projects requiring explicit written authorization (e.g., `solar-hub`) remain strictly isolated until dedicated licensing clearance is granted.
