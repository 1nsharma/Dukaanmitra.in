
'use server';
/**
 * @fileOverview The core DukaanMitra AI Agent, built on the Anigravity architecture.
 * This system processes incoming WhatsApp messages through a rule-driven, multi-tool
 * pipeline to ensure safe, accurate, and context-aware actions and replies.
 * 
 * Golden Rule: Accuracy > Automation. If unsure, escalate to a human.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { parseTransaction, ParseTransactionOutputSchema, type ParseTransactionOutput } from './transaction-parser-flow';
import { getMarketTrend, MarketTrendInputSchema, MarketTrendOutputSchema } from './market-trend-flow';

// ==================================================
// 1. INTENT & SCHEMA DEFINITIONS
// ==================================================
const SupportedIntentSchema = z.enum([
  'price_query',
  'availability_query',
  'payment_query',
  'order_create',
  'order_cancel',
  'ledger_entry',
  'shop_timing',
  'trend_related_question',
  'greeting',
  'unknown',
]);
type SupportedIntent = z.infer<typeof SupportedIntentSchema>;

const ShopContextSchema = z.object({
  shop_id: z.string(),
  name: z.string(),
  region: z.string().default('Mumbai'),
  paymentModes: z.array(z.string()),
  timings: z.string(),
  known_products_and_prices: z.string().describe("Simple string of known products and prices, e.g., 'Doodh ₹55/liter, Aata ₹40/kg'"),
  rules: z.object({
    credit_limit_per_transaction: z.number().default(5000),
    allow_credit: z.boolean().default(true),
  }),
});
export type ShopContext = z.infer<typeof ShopContextSchema>;

export const AgentInputSchema = z.object({
  query: z.string().describe('The raw WhatsApp message from the customer.'),
  shopContext: ShopContextSchema.describe('The context of the specific shop receiving the message.'),
});
export type AgentInput = z.infer<typeof AgentInputSchema>;

export const AgentOutputSchema = z.object({
  intent: SupportedIntentSchema,
  confidence: z.number().min(0).max(1),
  response: z.string().optional().describe("The generated Hinglish response for the customer."),
  action: z.any().optional().describe("A structured object for backend systems to execute."),
  escalate: z.boolean().describe("If true, the agent is unsure and is escalating to a human."),
  escalation_reason: z.string().optional(),
});
export type AgentOutput = z.infer<typeof AgentOutputSchema>;


// ==================================================
// 2. AGENT TOOLS
// ==================================================

/**
 * A tool that the AI agent can use to parse natural language into a structured transaction.
 */
const ledgerEntryTool = ai.defineTool(
  {
    name: 'createLedgerEntry',
    description: 'Use this to parse a credit (udhaar) or payment (jama) transaction. This is for financial entries only.',
    inputSchema: z.object({ 
        naturalLanguageQuery: z.string().describe('The user\'s message containing transaction details, like "Ravi 500 udhaar" or "Sunita paid 200".')
    }),
    outputSchema: ParseTransactionOutputSchema,
  },
  async ({ naturalLanguageQuery }) => {
    // We call the existing, robust flow for parsing.
    return parseTransaction({ query: naturalLanguageQuery });
  }
);

/**
 * A tool that the AI agent can use to get market trend data.
 */
const marketTrendTool = ai.defineTool(
    {
        name: 'getMarketTrend',
        description: 'Use this to get market trend data for a specific product in a region.',
        inputSchema: MarketTrendInputSchema,
        outputSchema: MarketTrendOutputSchema,
    },
    async (input) => {
        return getMarketTrend(input);
    }
);


// ==================================================
// 3. POLICY GUARD
// ==================================================

/**
 * Anigravity Tool: policy_guard
 * A synchronous function that enforces business rules before executing actions.
 */
function policyGuard(
  intent: SupportedIntent,
  transactionDetails: ParseTransactionOutput | null,
  shopContext: ShopContext
): { allowed: boolean; reason: string } {
  if (intent === 'ledger_entry' && transactionDetails?.type === 'credit') {
    if (!shopContext.rules.allow_credit) {
      return { allowed: false, reason: "Maaf kijiye, yeh dukaan udhaar nahi deti." };
    }
    if (transactionDetails.amount > shopContext.rules.credit_limit_per_transaction) {
      return { allowed: false, reason: `Udhaar ki rakam (₹${transactionDetails.amount}) dukaan ki limit (₹${shopContext.rules.credit_limit_per_transaction}) se zyada hai.` };
    }
  }
  return { allowed: true, reason: "" };
}

// ==================================================
// 4. THE CORE ANIGRAVITY AGENT
// ==================================================

const anigravityAgentPrompt = ai.definePrompt({
    name: 'anigravityAgentPrompt',
    tools: [ledgerEntryTool, marketTrendTool],
    input: { schema: AgentInputSchema },
    output: { schema: AgentOutputSchema },
    system: `You are DukaanMitra, an AI assistant for an Indian Kirana store owner, communicating via WhatsApp.
    Your persona: Helpful, polite, concise, and professional. You use simple Hinglish.
    Your goal: Understand the customer's message, use tools if necessary, and decide on the best action and response.

    SHOP CONTEXT:
    - Name: {{shopContext.name}}
    - Timings: {{shopContext.timings}}
    - Payment Modes: {{json shopContext.paymentModes}}
    - Known Products/Prices: {{shopContext.known_products_and_prices}}
    
    RESPONSE RULES:
    1.  Greeting: If the user says "hello" or "namaste", greet them back and ask how you can help.
    2.  Shop Info: Answer questions about shop timings or payment methods using the context above.
    3.  Product Info: Answer price or availability questions using the "Known Products/Prices" context. If a product is not in the list, say you need to check with the shopkeeper.
    4.  Ledger Entry: If the message is a transaction (e.g., "Ravi 500 udhaar", "Sunita paid 200"), you MUST use the 'createLedgerEntry' tool. Do NOT try to parse it yourself.
    5.  Market Trends: If the user asks about product trends (e.g., "what's popular in Mumbai?"), you MUST use the 'getMarketTrend' tool.
    6.  Unsupported Queries: For anything else (like placing a complex order or cancelling one), politely say you need to confirm with the shopkeeper.
    
    SAFETY & ESCALATION:
    - Your primary goal is safety. If you are less than 80% confident, it is better to escalate to a human.
    - Set 'escalate' to true if you are unsure or the query is unsupported. Your response should be "Iske liye shopkeeper se confirm karna hoga."
    
    OUTPUT INSTRUCTIONS:
    - You must respond with a valid JSON object matching the AgentOutputSchema.
    - 'intent' should be your classification of the user's primary goal.
    - 'response' should be a friendly, short Hinglish message for the customer.
    - If you used the 'createLedgerEntry' tool, use its output to construct the 'action' field in your final JSON output. The action object must look like this: { "type": "ADD_LEDGER_ENTRY", "payload": { ... } }. The 'payload' should contain 'shopId', 'customer' details, and 'transaction' details from the tool's output. The shopId is in the input context.
    - If you used the 'getMarketTrend' tool, simply formulate a human-friendly 'response' using the tool's output. Do not populate the 'action' field.
    `,
});


export const anigravityAgent = ai.defineFlow(
  {
    name: 'anigravityAgent',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {

    // 1. Execute the main agent prompt. Genkit handles the tool-calling loop automatically.
    const llmResponse = await anigravityAgentPrompt(input);
    const agentDecision = llmResponse.output();

    if (!agentDecision) {
      return {
        intent: 'unknown',
        confidence: 0,
        escalate: true,
        escalation_reason: 'LLM failed to generate a valid decision.',
        response: 'Sorry, I am having trouble understanding. Please try again.',
      };
    }
    
    // 2. Extract transaction details if an action was decided.
    let transactionDetails: ParseTransactionOutput | null = null;
    if (agentDecision.action && agentDecision.action.type === 'ADD_LEDGER_ENTRY') {
        // The LLM now structures the full payload, so we extract the transaction part for the policy guard.
        transactionDetails = agentDecision.action.payload.transaction as ParseTransactionOutput;
    }
    
    // 3. POLICY GUARD: Run the AI's decision through our business rule safety guard.
    const policyCheck = policyGuard(agentDecision.intent, transactionDetails, input.shopContext);
    if (!policyCheck.allowed) {
      // If a policy is violated, we override the AI's decision.
      return {
        intent: agentDecision.intent,
        confidence: 1.0, // It's a definite policy violation
        escalate: true,
        escalation_reason: `Policy Violation: ${policyCheck.reason}`,
        response: policyCheck.reason, // Inform the user of the specific reason.
        action: undefined, // CRITICAL: Clear any action that violates policy.
      };
    }

    // 4. Return the agent's final, policy-checked decision.
    return agentDecision;
  }
);


/**
 * A simple wrapper function to easily call the agent flow.
 * This would be triggered by the WhatsApp webhook infrastructure.
 */
export async function runWhatsappAgent(input: AgentInput): Promise<AgentOutput> {
  return anigravityAgent(input);
}
