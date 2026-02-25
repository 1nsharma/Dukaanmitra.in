# DukaanMitra - AI-Powered WhatsApp Munim

DukaanMitra is a production-grade, multi-tenant SaaS platform designed to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their business using natural language commands, powered by a sophisticated AI agent built with Google's Genkit.

---

## 🚀 Core Features

- **WhatsApp Munim**: Record credit and payments using simple messages like "Ravi 500 udhaar".
- **AI-Powered Insights**: Get analytics on sales, customers, and product trends automatically.
- **Digital Ledger (Khata)**: Secure, cloud-backed ledger accessible from any device.
- **Automated Reminders**: Polite, timely WhatsApp reminders for pending payments.
- **Super Admin Control**: Comprehensive panel for platform-wide management.

---

## 🏗️ Architecture

```
[WhatsApp] -> [Meta Cloud API] -> [Next.js API Webhook]
                                          |
                                          v
[Action Engine] <--- [Genkit AI Agent] <--- [Context Loader]
      |                                           |
      v                                           v
[Firestore (Data)] <---------------------- [Firebase Auth]
```

- **Frontend**: Next.js (App Router) with ShadCN UI and Tailwind.
- **AI Backend**: Google Genkit flows integrated directly into the Next.js environment.
- **Database & Auth**: Google Firebase (Firestore & Authentication).
- **Payments**: Razorpay Integration.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)

### 2. Installation
```bash
git clone https://github.com/1nsharma/Dukaanmitra.in.git
cd Dukaanmitra.in
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and fill in your credentials.
```bash
cp .env.example .env.local
```

### 4. Running the App
```bash
# Start Next.js
npm run dev

# Start Genkit Developer UI
npm run genkit:dev
```

---

## 📦 Deployment

### Production (Vercel)
The main application is designed to be deployed on Vercel. 
- Ensure all environment variables from `.env.local` are added to your Vercel project.
- **Public-Only Mode**: Set `PUBLIC_ONLY_MODE=true` to hide the application backend and only show the marketing site.

### Static Marketing Site (GitHub Pages)
The marketing pages are automatically deployed to GitHub Pages via GitHub Actions on every push to `main`. This is handled by `.github/workflows/deploy.yml`.

---

## 🔒 Security & Multi-Tenancy

- **Data Isolation**: Every shop is isolated via robust `firestore.rules`.
- **Role-Based Access**: Strict differentiation between `owner`, `staff`, and `super_admin`.
- **Policy Guard**: AI actions are validated against shop-specific business rules before execution.

---

## 📄 License
© 2024 DukaanMitra Technologies Pvt. Ltd. All rights reserved.
