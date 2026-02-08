# DukaanMitra API Endpoints

This document lists the primary server-side endpoints for the DukaanMitra application.

## Public API Routes (Next.js)

These endpoints are exposed to the internet and are the primary entry points for external services.

### WhatsApp Webhook

-   **Endpoint**: `POST /api/whatsapp`
-   **Description**: Receives incoming message notifications from the Meta (WhatsApp) Cloud API. This is the main entry point for all customer interactions via WhatsApp.
-   **Security**: Secured by a signature verification middleware that validates the `x-hub-signature-256` header to ensure requests are genuinely from Meta.
-   **Request Body**: The raw, structured JSON payload from the WhatsApp Cloud API.
-   **Response**: Immediately returns a `200 OK` to acknowledge receipt. All processing happens asynchronously in the background.

-   **Endpoint**: `GET /api/whatsapp`
-   **Description**: Used for the one-time webhook verification process required by Meta. Responds to a challenge request.
-   **Security**: Validates a `hub.verify_token` against an environment variable.

### Contact Form

-   **Endpoint**: `POST /api/contact`
-   **Description**: Handles submissions from the public website's contact form. It sends an email to the support address and logs the submission to Firestore.
-   **Request Body**:
    ```json
    {
      "name": "string",
      "email": "string",
      "subject": "string",
      "message": "string"
    }
    ```
-   **Response**: Returns `200 OK` on success or `500` on failure.

## Internal Service APIs (Genkit Flows)

These are not exposed as HTTP endpoints but function as internal, strongly-typed APIs that can be called from server-side code (e.g., from the dashboard or other services).

### `anigravityAgent`

-   **Function**: `anigravityAgent(input: AgentInput): Promise<AgentOutput>`
-   **Description**: The core AI agent flow. It takes a user's query and the shop's context and returns a structured output containing the determined intent, a generated response, a potential action, and an escalation flag.

### `parseTransaction`

-   **Function**: `parseTransaction(input: ParseTransactionInput): Promise<ParseTransactionOutput>`
-   **Description**: An AI-powered tool that parses a natural language (Hinglish) string into a structured transaction object (`customer_name`, `amount`, `type`, etc.).

### `generateRetailInsights`

-   **Function**: `generateRetailInsights(input: RetailInsightsInput): Promise<RetailInsightsOutput>`
-   **Description**: An AI flow that analyzes a shop's transaction and customer data to generate actionable insights, such as key action items, customer behavior analysis, and revenue leakage warnings.

### `getMarketTrend`

-   **Function**: `getMarketTrend(input: MarketTrendInput): Promise<MarketTrendOutput>`
-   **Description**: A tool that simulates fetching market trend data for a given product and region. In a full implementation, this would connect to a real data source like the Google Trends API.
