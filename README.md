# DukaanMitra - AI-Powered WhatsApp Munim

Welcome to DukaanMitra, a production-grade, multi-tenant SaaS platform designed to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their business using natural language commands, powered by a sophisticated AI agent built with Google's Genkit.

This repository contains the full-stack Next.js application, the Genkit AI backend, and the complete Firebase configuration.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Design Principles](#core-design-principles)
- [Architecture](#architecture)
- [Multi-Tenancy & Security](#multi-tenancy--security)
- [Tech Stack](#tech-stack)
- [Local Development Setup](#local-development-setup)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Roadmap](#roadmap)


---

## Project Overview

DukaanMitra is not just a chatbot; it's a complete business management tool that lives inside WhatsApp. It allows shop owners to:
- **Manage their Ledger (Khata)**: Record credit and payments using simple messages like "Ravi 500 udhaar".
- **Customer Management**: Automatically builds a customer database from WhatsApp interactions.
- **AI-Powered Insights**: Get analytics on sales, customers, and product trends.
- **Super Admin Panel**: A built-in control panel for managing users and system settings across the entire platform.

The system is designed to be multi-tenant, secure, and scalable from day one.

## Core Design Principles

- **WhatsApp-first UX**: Zero app installs for shop owners.
- **Multi-tenant isolation**: Every shop runs in a secure data boundary.
- **Event-driven AI actions**: Messages → intents → verified operations.
- **No raw AI trust**: All actions pass through policy & validation layers.
- **Scales serverlessly**: No fixed infra cost as users grow.

## Architecture

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

- **Frontend**: A Next.js application serves the public website, user dashboard, and super admin panel.
- **AI Backend**: Google Genkit flows are integrated directly into the Next.js server environment, acting as the "brain" of the AI agent. A dedicated API route (`/api/whatsapp`) serves as the secure webhook for the WhatsApp Business API. The AI agent never writes directly to the database. All state changes pass through the Action Engine which enforces: permission checks, data validation, duplicate prevention, and business rules. This prevents hallucinated or malicious operations.
- **Database & Auth**: Google Firebase provides the user authentication and the scalable, secure Firestore database that powers the entire application. Data access is controlled by robust `firestore.rules`.

## Multi-Tenancy & Security

- Each shop is isolated by Firestore security rules.
- AI context loads only tenant-scoped data.
- Admin actions audited in system logs.
- Webhooks verified using secrets.

No cross-shop data access is possible.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Database**: [Google Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **AI Engine**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **AI Model**: [Google Gemini](https://deepmind.google.com/technologies/gemini/)
- **Payments**: [Razorpay](https://razorpay.com/)

## Local Development Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Install Dependencies
This project uses `npm` for package management.
```bash
npm install
```

### 3. Set Up Environment Variables
Copy the contents of `.env` into a new file named `.env.local` and fill in the required values. This file will be used for your local development environment and is ignored by Git. See the [Environment Variables](#environment-variables) section below for details.

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

To receive webhooks from WhatsApp and Razorpay locally, you will need to use a tunneling service like `ngrok`.
```bash
ngrok http 3000
```
Use the HTTPS URL provided by ngrok (e.g., `https://<random-string>.ngrok-free.app`) and set it as your webhook URL in the Meta and Razorpay dashboards, appending the correct path (`/api/whatsapp` or `/api/verify-payment`).

## Deployment

The application is configured for easy deployment to serverless platforms that support Next.js.

### Vercel (Recommended)
You can deploy this repository directly to [Vercel](https://vercel.com/) with zero configuration. Vercel will automatically detect the Next.js framework and set up the build pipeline.

1.  Push your code to a GitHub repository.
2.  Import the repository into Vercel.
3.  **Crucially, you must add all the environment variables listed in `.env.local` to your Vercel project's settings under "Environment Variables".**
4.  Once deployed, you can assign your custom domain (e.g., `dukaanmitra.in`) in the Vercel project's "Domains" tab.

### Firebase App Hosting
The project also includes an `apphosting.yaml` file, making it ready for deployment on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## Environment Variables

You need to set the following environment variables in a `.env.local` file for local development, or in your hosting provider's settings for production.

```plaintext
# For Google AI / Genkit (Gemini)
# Get your key from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=""

# For sending emails from the contact form
MAILGUN_API_KEY=""
MAILGUN_DOMAIN=""
CONTACT_EMAIL_RECIPIENT=""
MAILGUN_FROM_EMAIL=""

# --- For WhatsApp Business API Integration ---
WHATSAPP_VERIFY_TOKEN=""
WHATSAPP_WEBHOOK_SECRET=""
WHATSAPP_API_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""

# --- For Razorpay Payment Gateway ---
# Get your keys from the Razorpay Dashboard under Settings -> API Keys
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID="" # This is also needed on the client-side for checkout
# Create a webhook in the Razorpay Dashboard (Settings -> Webhooks) and set this as the secret.
RAZORPAY_WEBHOOK_SECRET=""

# --- For Firebase Admin SDK (Server-Side Operations) ---
# In your Firebase project settings under "Service accounts", generate a new private key.
# Paste the entire contents of the downloaded JSON file here as a single-line string.
FIREBASE_SERVICE_ACCOUNT_KEY=''

# --- For Google OAuth ---
# The web client ID for Google Sign-In, obtained from Google Cloud Console.
GOOGLE_CLIENT_ID="675229096057-tahuuv8egdlgkualt2qumcclv214fqcm.apps.googleusercontent.com"

# ===================================================================
# ==         CLIENT-SIDE FIREBASE CONFIGURATION (REQUIRED)         ==
# ===================================================================
# These variables are needed on the client-side to connect to your Firebase project.
# Copy them from your Firebase project settings.

NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
```

## Running the Application

- **Development**: `npm run dev` - Starts the Next.js app in development mode with hot-reloading.
- **Production Build**: `npm run build` - Creates an optimized production build.
- **Start Production Server**: `npm run start` - Starts the production server.

## Roadmap

- Voice note bill processing
- Automated payment reminders
- GST-ready reports
- Inventory forecasting
- Credit risk scoring
- Merchant mobile app (optional)

Built on the same AI action engine.
