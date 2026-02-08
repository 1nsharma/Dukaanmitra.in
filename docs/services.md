# DukaanMitra Backend Services

This document provides a breakdown of the key backend services and their responsibilities, illustrating the separation of concerns in the system. All services are located in `src/lib/services/`.

## 1. WhatsApp Service

-   **File**: `whatsapp.ts`
-   **Responsibilities**:
    -   **Message Handling**: Contains the `handleWhatsAppMessage` function, which is the entry point for processing payloads from the webhook. It's responsible for parsing the payload, identifying text messages, and normalizing the data.
    -   **Asynchronous Processing**: Immediately acknowledges webhook requests and dispatches the message to the Agent Runner for background processing to avoid timeouts from Meta.
    -   **Sending Replies**: Provides the `sendWhatsAppMessage` function, which formats and sends a text message back to the user via the Meta Graph API. This function includes error handling for failed API calls.

## 2. Context Loader Service

-   **File**: `context-loader.ts`
-   **Responsibilities**:
    -   **Multi-Tenancy Core**: Implements the `loadShopContextByWhatsappNumber` function, which is fundamental to the app's multi-tenant architecture.
    -   **Data Fetching**: Queries the `shops` collection in Firestore to find the specific shop document associated with the incoming WhatsApp business number.
    -   **Context Assembly**: Constructs the `ShopContext` object required by the AI agent. This object includes the shop's ID, name, region, and business rules, ensuring the agent operates with the correct, isolated data for that specific tenant.

## 3. Agent Runner Service

-   **File**: `agent-runner.ts`
-   **Responsibilities**:
    -   **Orchestration**: Contains the `runAgentForMessage` function, which acts as the main orchestrator for the entire AI process.
    -   **Execution Flow**: Manages the sequence of operations:
        1.  Calls the **Context Loader** to get the shop's context.
        2.  Prepares the input and executes the main **Genkit AI Agent** (`anigravityAgent`).
        3.  Receives the structured output from the agent.
        4.  Routes the output to the appropriate downstream service.
    -   **Decision Routing**: Based on the agent's output, it decides whether to call the **Action Engine** (if there's a database action), the **WhatsApp Service** (to send a reply), or log an escalation.

## 4. Action Engine Service

-   **File**: `action-engine.ts`
-   **Responsibilities**:
    -   **Database Write Gateway**: The *only* service that should perform agent-initiated writes to the database. This creates a secure and auditable bottleneck.
    -   **Action Execution**: Contains the `executeAction` function, which takes a structured action (e.g., `{ type: 'ADD_LEDGER_ENTRY', payload: {...} }`) from the Agent Runner.
    -   **Business Logic & Data Integrity**: Implements the logic for specific actions. For example, `handleAddLedgerEntry` performs a batched (atomic) write to both create the ledger entry and update the customer's statistics simultaneously, ensuring data consistency.
    -   **Safety**: This service is the final checkpoint for applying business rules before modifying data.
