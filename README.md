# DukaanMitra - AI-Powered WhatsApp Munim

Welcome to DukaanMitra, a production-grade, multi-tenant SaaS platform designed to digitize India's Kirana stores. It leverages a "WhatsApp-first" approach, allowing shop owners to manage their business using natural language commands, powered by a sophisticated AI agent built with Google's Genkit.

This repository contains the full-stack Next.js application, the Genkit AI backend, and the complete Firebase configuration.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)

---

## Project Overview

DukaanMitra is not just a chatbot; it's a complete business management tool that lives inside WhatsApp. It allows shop owners to:
- **Manage their Ledger (Khata)**: Record credit and payments using simple messages like "Ravi 500 udhaar".
- **Customer Management**: Automatically builds a customer database from WhatsApp interactions.
- **AI-Powered Insights**: Get analytics on sales, customers, and product trends.
- **Super Admin Panel**: A built-in control panel for managing users and system settings across the entire platform.

The system is designed to be multi-tenant, secure, and scalable from day one.

## Architecture

The system is built on a modern, serverless architecture centered around Next.js and Google Firebase.

```
+------------------------+
|   Next.js Frontend     |
| (UI, Dashboard, Pages) |
+------------------------+
           |
           v
+------------------------+
|   Genkit AI Agent      |
| (Runs inside Next.js)  |
| - Intent Detection     |
| - Tool Orchestration   |
| - Safety Guards        |
+------------------------+
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
- **AI Backend**: Google Genkit flows are integrated directly into the Next.js server environment, acting as the "brain" of the AI agent.
- **Database & Auth**: Google Firebase provides the user authentication and the scalable, secure Firestore database that powers the entire application. Data access is controlled by robust `firestore.rules`.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Database**: [Google Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **AI Engine**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **AI Model**: [Google Gemini](https://deepmind.google/technologies/gemini/)

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
Create a `.env` file in the root of the project by copying the example:
```bash
cp .env.example .env
```
Now, fill in the required values in your new `.env` file. See the [Environment Variables](#environment-variables) section below for details.

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## Environment Variables

You need to set the following environment variables in your `.env` file for the application to function correctly.

```plaintext
# For Google AI / Genkit (Gemini)
# Get your key from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# For sending emails from the contact form
# You can use any email provider, this example uses Mailgun
MAILGUN_API_KEY="YOUR_MAILGUN_API_KEY"
MAILGUN_DOMAIN="YOUR_MAILGUN_DOMAIN"
CONTACT_EMAIL_RECIPIENT="your-support-email@example.com"
MAILGUN_FROM_EMAIL="DukaanMitra <no-reply@yourdomain.com>"
```
**Note**: The Firebase configuration is hard-coded in `src/firebase/config.ts` as it contains public, non-sensitive keys.

## Running the Application

- **Development**: `npm run dev` - Starts the Next.js app in development mode with hot-reloading.
- **Production Build**: `npm run build` - Creates an optimized production build of the application.
- **Start Production Server**: `npm run start` - Runs the production build.

## Deployment

The application is configured for easy deployment to serverless platforms that support Next.js.

### Firebase App Hosting
The project includes an `apphosting.yaml` file, making it ready for deployment on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

### Vercel
You can also deploy this repository directly to [Vercel](https://vercel.com/) with zero configuration. Vercel will automatically detect the Next.js framework and set up the build pipeline.
