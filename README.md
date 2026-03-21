# DukaanMitra - AI-Powered WhatsApp Munim

Welcome to DukaanMitra, a production-grade, multi-tenant SaaS platform designed to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their business using natural language commands, powered by a sophisticated AI agent built with Google's Genkit.

This repository contains the full-stack Next.js application, the Genkit AI backend, and the complete Firebase configuration.

## 🚀 Core Features
- **WhatsApp Ledger**: Deterministic & AI-powered accounting via simple chat (e.g., "Ravi 500 udhaar").
- **Automated Summaries**: Daily sales and credit reports sent directly to owners via WhatsApp in IST.
- **Udhaar Reminders**: Automatic, polite collection reminders for pending credit.
- **Super Admin**: Multi-tenant management and platform-wide metrics dashboard.
- **24/7 AI Salesman**: Answers customer queries about prices and availability even when the shop is closed.

---

## 🏗️ Architecture

The system is built on a modern, serverless architecture centered around Next.js and Google Firebase.

```
+------------------------+      +--------------------------+
|   WhatsApp Business    |----->|   Next.js API Route      |
|   (via Meta Cloud API) |      |   (Webhook Endpoint)     |
+------------------------+      +--------------------------+
                                           |
                                           v
+--------------------------------------------------------------------+
|   Anigravity AI Agent (Genkit Flow running in Next.js)             |
|                                                                    |
|   1. Intent Detection (Rule-based + LLM)                           |
|   2. Context Loading (Shop data from Firestore)                    |
|   3. Policy Guard (Enforces shop-specific rules)                   |
|   4. Decision Routing (Decides to Reply, Act, or Escalate)         |
|                                                                    |
|   + Executes Actions (via Action Engine Service)                   |
|   + Generates Replies (via WhatsApp Client)                        |
+--------------------------------------------------------------------+
           |                      |
           v                      v
+------------------------+      +---------------------------------+
|   Action Engine        |      |    WhatsApp Client              |
| (Writes to Firestore)  |      |    (Sends reply to Meta API)    |
+------------------------+      +---------------------------------+
           |
           v
+------------------------+
|   Firebase Backend     |
| - Firestore (Database) |
| - Auth (Users)         |
| - Hosting              |
+------------------------+
```

### Core Design Principles
- **WhatsApp-first UX**: Zero app installs for shop owners.
- **Multi-tenant isolation**: Every shop runs in a secure data boundary enforced by Firestore rules.
- **No raw AI trust**: All actions pass through policy & validation layers (Action Engine).
- **Scalable serverless**: No fixed infra cost as users grow.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React, Tailwind CSS, ShadCN UI
- **Database**: Google Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **AI Engine**: Google Genkit + Gemini 2.5 Flash
- **Payments**: Razorpay

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory.

```plaintext
# For Google AI / Genkit (Gemini)
GEMINI_API_KEY=""

# For sending emails (Contact Form)
MAILGUN_API_KEY=""
MAILGUN_DOMAIN=""
CONTACT_EMAIL_RECIPIENT=""
MAILGUN_FROM_EMAIL=""

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN=""
WHATSAPP_WEBHOOK_SECRET=""
WHATSAPP_API_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""
RAZORPAY_WEBHOOK_SECRET=""

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
```

---

## 📦 Deployment

### Vercel (Public Marketing)
The Vercel deployment acts as the "Public Face" (/, /features, /pricing). Access to `/dashboard` is blocked via middleware.

### Firebase (App Hosting)
The Firebase deployment hosts the functional dashboard, secure APIs, and AI agents.

---

## 🚦 Local Development Setup

1. **Clone & Install**:
   ```bash
   git clone <repo-url>
   npm install
   ```
2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
3. **Webhook Tunneling**:
   To receive WhatsApp/Razorpay webhooks locally, use `ngrok`:
   ```bash
   ngrok http 3000
   ```

## 🗺️ Roadmap
- Voice note bill processing
- GST-ready reporting
- Inventory forecasting
- Merchant credit risk scoring

Built with ❤️ for India's Kirana community.