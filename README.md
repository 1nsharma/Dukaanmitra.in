
# DukaanMitra - AI-Powered WhatsApp Munim

Production-ready SaaS platform for digitizing India's Kirana stores.

## 🚀 Core Features
- **WhatsApp Ledger**: Deterministic & AI-powered accounting via simple chat.
- **Automated Summaries**: Daily IST sales reports sent directly to owners.
- **Udhaar Reminders**: Automatic, polite collection reminders for credit.
- **Super Admin**: Multi-tenant management and platform-wide metrics.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Firebase Functions + Genkit (AI Orchestration)
- **Database**: Firestore (Multi-tenant)
- **Messaging**: Meta (WhatsApp) Cloud API

## 📦 Deployment
### Vercel (Public Marketing)
The Vercel deployment acts as the "Public Face" (/, /features, /pricing). Access to `/dashboard` is blocked via middleware.

### Firebase (App Engine)
The Firebase deployment hosts the functional dashboard, secure APIs, and AI agents.

## 🔐 Environment Variables
Required for full functionality:
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase connection.
- `WHATSAPP_API_TOKEN`: Meta access token.
- `WHATSAPP_PHONE_NUMBER_ID`: Meta phone ID.
- `GOOGLE_GENAI_API_KEY`: Powers the AI Munim.
