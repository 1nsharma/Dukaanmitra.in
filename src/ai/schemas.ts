
/**
 * @fileOverview Centralized Zod schemas for all AI flows.
 * This file does NOT use 'use server' and can be safely imported by server components
 * to access schema definitions for tools, inputs, and outputs.
 */

import { z } from 'zod';

// ==================================================
// transaction-parser-flow.ts Schemas
// ==================================================
export const ParseTransactionInputSchema = z.object({
  query: z.string().describe('The natural language transaction query from the user.'),
});
export type ParseTransactionInput = z.infer<typeof ParseTransactionInputSchema>;

// The schema used by the prompt for better enum handling.
export const TransactionParserPromptOutputSchema = z.object({
    phone: z.string().optional().describe("The customer's 10-digit phone number, if mentioned."),
    customer_name: z.string().describe("The name of the customer. If no name is found, defaults to 'Customer'."),
    amount: z.number().describe('The transaction amount as an integer.'),
    items: z.string().describe('A string listing the items involved in the transaction.'),
    type: z.enum(['CREDIT', 'PAYMENT']).describe('The type of transaction: CREDIT (udhaar) or PAYMENT (jama).'),
    confidence_score: z.number().min(0).max(1).describe('The AI model\'s confidence in the accuracy of the parsed data.'),
});
export type TransactionParserPromptOutput = z.infer<typeof TransactionParserPromptOutputSchema>;


// The clean, lowercase output schema for the rest of the application.
export const ParseTransactionOutputSchema = TransactionParserPromptOutputSchema.extend({
    type: z.enum(['credit', 'payment']),
});
export type ParseTransactionOutput = z.infer<typeof ParseTransactionOutputSchema>;


// ==================================================
// market-trend-flow.ts Schemas
// ==================================================
export const MarketTrendInputSchema = z.object({
  product: z.string().describe('The product to check the trend for, e.g., "Mangoes", "Umbrellas".'),
  region: z.string().describe('The region for the trend, e.g., "Delhi", "Mumbai".'),
});
export type MarketTrendInput = z.infer<typeof MarketTrendInputSchema>;

export const MarketTrendOutputSchema = z.object({
  demand_score: z.number().min(0).max(100).describe('A score from 0-100 indicating current market demand.'),
  trend_direction: z.enum(['up', 'down', 'stable']).describe('The recent direction of the demand trend.'),
  trend_duration_days: z.number().describe('The number of days the current trend has been active.'),
  seasonal_factor: z.number().min(0).max(1).describe('A score from 0-1 indicating how much the trend is influenced by seasonality.'),
});
export type MarketTrendOutput = z.infer<typeof MarketTrendOutputSchema>;


// ==================================================
// whatsapp-agent-flow.ts Schemas
// ==================================================
export const SupportedIntentSchema = z.enum([
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
export type SupportedIntent = z.infer<typeof SupportedIntentSchema>;

export const ShopContextSchema = z.object({
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
// retail-insights-flow.ts Schemas
// ==================================================
export const LedgerEntrySchema = z.object({
    amount: z.number(),
    createdAt: z.any().describe("Timestamp of the transaction"),
    customerName: z.string().optional(),
    item: z.string().optional(),
    type: z.enum(['credit', 'payment']),
});

export const CustomerSchema = z.object({
    name: z.string().optional(),
    visit_count: z.number().optional(),
    total_spent: z.number().optional(),
    last_visit: z.any().describe("Timestamp of last visit"),
    status: z.string().optional(),
});

export const RetailInsightsInputSchema = z.object({
  ledgerEntries: z.array(LedgerEntrySchema).describe("List of transactions from the last 30 days."),
  customers: z.array(CustomerSchema).describe("List of all customers."),
});
export type RetailInsightsInput = z.infer<typeof RetailInsightsInputSchema>;

export const RetailInsightsOutputSchema = z.object({
  keyActionItems: z.array(z.string()).describe("A list of 3 clear, actionable items for the shop owner in simple Hinglish."),
  customerInsights: z.string().describe("Insights about customer behavior (e.g., repeat vs one-time, churn signals). Simple Hinglish, no jargon."),
  fastMovingItems: z.string().describe("Analysis of fast-moving items from the 'item' field. Simple Hinglish, no jargon."),
  operationalInefficiencies: z.string().describe("Analysis of operational inefficiencies based on transaction patterns. Simple Hinglish, no jargon."),
  revenueLeakage: z.string().describe("Analysis of potential revenue leakage (e.g., high credit to new customers). Simple Hinglish, no jargon."),
});
export type RetailInsightsOutput = z.infer<typeof RetailInsightsOutputSchema>;


// ==================================================
// interactive-ai-demo.ts Schemas
// ==================================================
export const InteractiveAIDemoInputSchema = z.object({
  query: z.string().describe('The user query for the product demo.'),
});
export type InteractiveAIDemoInput = z.infer<typeof InteractiveAIDemoInputSchema>;

export const InteractiveAIDemoOutputSchema = z.object({
  response: z.string().describe('The AI response to the user query.'),
});
export type InteractiveAIDemoOutput = z.infer<typeof InteractiveAIDemoOutputSchema>;
