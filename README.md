
# DukaanMitra - AI-Powered WhatsApp Munim

DukaanMitra is a production-grade, multi-tenant SaaS platform designed to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their business using natural language commands.

---

## 🚀 Core Features

- **WhatsApp Munim**: Record credit and payments using simple messages like "Ravi 500 udhaar".
- **AI-Powered Insights**: Get analytics on sales, customers, and product trends automatically.
- **Digital Ledger (Khata)**: Secure, cloud-backed ledger accessible from any device.
- **Automated Reminders**: Polite, timely WhatsApp reminders for pending payments.
- **Super Admin Control**: Comprehensive panel for platform-wide management.

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
Create a `.env.local` file using `.env.example` as a template. Add your Firebase and API credentials.

### 4. Running the App
```bash
npm run dev
```

---

## 📦 Deployment Strategy

### Primary App (Vercel)
The main application (Dashboard, Auth, API Webhooks) is deployed on Vercel. 
- **Domain**: `dukaanmitra.in`
- **DNS (GoDaddy)**: 
  - A Record: `@` -> `76.76.21.21`
  - CNAME Record: `www` -> `cname.vercel-dns.com`

### Public Marketing Site (GitHub Pages)
Public marketing pages are automatically built and deployed to GitHub Pages via GitHub Actions on every push to `main`.
- **Workflow**: `.github/workflows/deploy.yml`
- **Static Export**: Uses `next export` via `BUILD_STATIC=true` env variable.

---

## 🔒 Security & Multi-Tenancy

- **Data Isolation**: Every shop is isolated via robust `firestore.rules`.
- **Route Guards**: The `(app)` route group enforces authentication and account status checks via a centralized layout.
- **Role-Based Access**: Strict differentiation between `owner`, `staff`, and `super_admin`.

---

## 📄 License
© 2024 DukaanMitra Technologies Pvt. Ltd. All rights reserved.
