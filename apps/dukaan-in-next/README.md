
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

## Supabase + Vercel Auto Data Injection
If your app is deployed on Vercel and you want to auto-push events/data into Supabase, configure these env vars in **Vercel Project Settings → Environment Variables**:

- `SUPABASE_URL` (recommended) or `NEXT_PUBLIC_docs_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended) or `docs_SUPABASE_SERVICE_ROLE_KEY`

> Security note: never commit real Supabase keys/passwords in git. If a key was exposed, rotate it immediately in Supabase dashboard.

API route added: `POST /api/supabase/ingest`

Example payload:

```json
{
  "eventType": "order_created",
  "shopId": "shop_123",
  "source": "vercel",
  "payload": {
    "amount": 950,
    "customer": "Ravi"
  }
}
```

Expected Supabase table (create once):

```sql
create table if not exists public.ingestion_events (
  id bigserial primary key,
  event_type text not null,
  shop_id text,
  source text not null default 'vercel',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```
