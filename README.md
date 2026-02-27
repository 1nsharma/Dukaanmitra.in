
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

## 🛠️ Vercel Deployment & Environment Variables (CRITICAL)

When deploying to Vercel, you **must** add the following Environment Variables in the Vercel Dashboard (**Settings > Environment Variables**). 

### **Why are these mandatory?**
Vercel hosts your UI, but these keys connect your UI to the "Organs" of your app:
- **Firebase Keys**: Connects your app to the Firestore database and Auth. Without these, **Login will fail**.
- **Razorpay Keys**: Enables the subscription system. Without these, **Payments will crash**.
- **Google AI Key**: Powers the "AI Munim". Without this, **Hinglish parsing will fail**.

### **Checklist for Vercel Dashboard:**
Copy these names and paste your actual values from the Firebase/Razorpay consoles:

| Key Name | Description |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `project-id.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your unique Firebase ID |
| `GOOGLE_GENAI_API_KEY` | From Google AI Studio (Gemini) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | From Razorpay Dashboard > Settings > API Keys |
| `RAZORPAY_KEY_SECRET` | From Razorpay Dashboard (Keep this private!) |

---

## 📦 Local Development Setup

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
Create a `.env.local` file using `.env.example` as a template. **Do not commit this file to Git.**

### 4. Running the App
```bash
npm run dev
```

---

## 📄 License
© 2024 DukaanMitra Technologies Pvt. Ltd. All rights reserved.
