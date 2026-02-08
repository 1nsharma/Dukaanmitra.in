# DukaanMitra System Architecture

This document outlines the high-level architecture of the DukaanMitra platform, detailing the flow of data from WhatsApp to the backend services and database.

## Core Components

The system is designed as a modular, event-driven architecture that leverages serverless functions for scalability and efficiency.

1.  **WhatsApp Webhook (`/api/whatsapp`)**: The single entry point for all incoming data from the Meta (WhatsApp) Cloud API. It is responsible for security verification and immediately passing the raw payload to the WhatsApp Service for processing.

2.  **WhatsApp Service (`src/lib/services/whatsapp.ts`)**: Normalizes the incoming webhook payload, extracts the message content, and triggers the Agent Runner. It also provides a function to send replies back to the user.

3.  **Agent Runner (`src/lib/services/agent-runner.ts`)**: The main orchestrator. It loads the necessary context for the shop, executes the core Genkit AI agent, and routes the agent's output to the appropriate downstream service (Action Engine or WhatsApp Service).

4.  **Context Loader (`src/lib/services/context-loader.ts`)**: A crucial service that fetches shop-specific data, rules, and configurations from Firestore based on the incoming WhatsApp number. This ensures the AI agent operates within the correct multi-tenant context.

5.  **Genkit AI Agent (`src/ai/flows/whatsapp-agent-flow.ts`)**: The "brain" of the system. It uses a combination of rule-based logic and LLM-powered tools (like intent detection and transaction parsing) to understand the user's message and decide on a course of action (reply, act, or escalate).

6.  **Action Engine (`src/lib/services/action-engine.ts`)**: A protected service that executes database writes. It receives structured action commands from the Agent Runner (e.g., `ADD_LEDGER_ENTRY`) and performs the necessary atomic writes to Firestore, ensuring data integrity.

7.  **Firebase Firestore**: The primary NoSQL database used for all application data, including shops, users, customers, and ledgers. Access is controlled by strict security rules.

## Data Flow Diagram: Ledger Entry

This diagram illustrates the step-by-step flow for a typical "Udhaar" (credit) entry message.

```
[Customer on WhatsApp]
       |
       | 1. Sends message: "Ravi 500 udhaar"
       v
[Meta Cloud API]
       |
       | 2. POST request to Webhook
       v
+-----------------------------+
| Next.js App (Webhook API)   |
| /api/whatsapp/route.ts      |
| - Verifies signature        |------> [Logs & Monitoring]
| - Dispatches to service     |
+-----------------------------+
       |
       | 3. handleWhatsAppMessage(payload)
       v
+-----------------------------+
| WhatsApp Service            |
| - Normalizes message        |
| - Triggers Agent Runner     |
+-----------------------------+
       |
       | 4. runAgentForMessage(normalizedMsg)
       v
+-----------------------------+
| Agent Runner                |
| - Calls Context Loader      |------> [Firestore (Read Shop)]
| - Executes Genkit Agent     |
+-----------------------------+
       |
       | 5. anigravityAgent(input)
       v
+-----------------------------+
| Genkit AI Agent             |
| - Runs `parseTransaction`   |------> [Gemini API]
| - Runs `detectIntent`       |------> [Gemini API]
| - Passes Policy Guard       |
| - Returns structured output:|
|   { action: 'ADD_LEDGER..', |
|     response: 'Theek hai...' }|
+-----------------------------+
       |
       | 6. Agent output received
       v
+-----------------------------+
| Agent Runner (continued)    |
| - If action, call Action Engine |
| - If response, call WhatsApp Svc|
+-----------------------------+
       |                  |
       | 7a. executeAction()  | 7b. sendWhatsAppMessage()
       v                  v
+------------------+     +------------------------+
| Action Engine    |     | WhatsApp Service       |
| - Batched Write  |     | - Calls Meta Graph API |
|   - Add Ledger   |     +------------------------+
|   - Update Cust. |            |
+------------------+            | 8. Reply sent
       |                        v
       | 7c. Commit to DB    [Customer on WhatsApp]
       v
[Firestore (Write)]

```
