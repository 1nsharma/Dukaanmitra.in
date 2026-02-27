# DukaanMitra - AI-Powered WhatsApp Munim

DukaanMitra is a production-grade, multi-tenant SaaS platform designed to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their business using natural language commands, powered by a sophisticated AI agent.

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
Create a `.env.local` file and add your Firebase and API credentials. See `.env.example` for required keys.

### 4. Running the App
```bash
npm run dev
```

---

## 📦 Deployment

### Production (Vercel)
The main application is deployed on Vercel. 
- Ensure all environment variables are added to your Vercel project settings.
- **DNS (GoDaddy)**: 
  - A Record: `@` -> `76.76.21.21`
  - CNAME Record: `www` -> `cname.vercel-dns.com`

### Static Marketing Site (GitHub Pages)
The marketing pages are automatically deployed to GitHub Pages via GitHub Actions on every push to `main`. 
- **Domain**: `dukaanmitra.in`
- **Workflow**: `.github/workflows/deploy.yml`

---

## 🔒 Security & Multi-Tenancy

- **Data Isolation**: Every shop is isolated via robust `firestore.rules`.
- **Role-Based Access**: Strict differentiation between `owner`, `staff`, and `super_admin`.
- **Route Guard**: The `(app)` route group enforces authentication and account status checks.

---

## 📄 License
© 2024 DukaanMitra Technologies Pvt. Ltd. All rights reserved.
