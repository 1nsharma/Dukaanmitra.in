# DukaanMitra - AI-Powered WhatsApp Munim

Welcome to DukaanMitra, a production-grade, multi-tenant SaaS platform designed to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their business using natural language commands, powered by a sophisticated AI agent built with Google's Genkit.

## 🚀 Core Features
- **WhatsApp Ledger**: Deterministic & AI-powered accounting via simple chat (e.g., "Ravi 500 udhaar").
- **Automated Summaries**: Daily sales and credit reports sent directly to owners via WhatsApp.
- **Udhaar Reminders**: Automatic, polite collection reminders for pending credit.
- **Super Admin**: Multi-tenant management and platform-wide metrics dashboard.
- **24/7 AI Salesman**: Answers customer queries about prices and availability even when the shop is closed.

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

## 🛠️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Database**: [Google Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **AI Engine**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **AI Model**: [Google Gemini](https://deepmind.google.com/technologies/gemini/)
- **Payments**: [Razorpay](https://razorpay.com/)

## 🔐 Environment Variables

You need to set the following environment variables in a `.env.local` file for the application to function correctly.

```plaintext
# For Google AI / Genkit (Gemini)
GEMINI_API_KEY=""

# WhatsApp Business API Integration
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
FIREBASE_SERVICE_ACCOUNT_KEY=''
```

## 📦 Deployment
### Vercel (Public Marketing)
The Vercel deployment acts as the "Public Face" (/, /features, /pricing). Access to `/dashboard` is blocked via middleware.

### Firebase (App Engine)
The Firebase deployment hosts the functional dashboard, secure APIs, and AI agents.

Built with ❤️ for India's Kirana community.