/**
 * @fileOverview Centralized Zod schemas for MitraOS AI Agents.
 * This file avoids 'use server' to remain safe for client/server imports
 * and prevents Next.js 15 build errors.
 */

import { z } from 'zod';

// ==================================================
// Common Types
// ==================================================
export const SupportedIntentSchema = z.enum([
  'price_query',
  'availability_query',
  'payment_query',
  'ledger_entry',
  'shop_timing',
  'greeting',
  'unknown',
]);

export const ShopContextSchema = z.object({
  shop_id: z.string(),
  name: z.string(),
  region: z.string(),
  paymentModes: z.array(z.string()),
  timings: z.string(),
  known_products_and_prices: z.string(),
  rules: z.object({
    credit_limit_per_transaction: z.number(),
    allow_credit: z.boolean(),
  }),
});

// ==================================================
// Munim AI (Finance & Billing)
// ==================================================
export const ParseTransactionInputSchema = z.object({
  query: z.string().describe('Hinglish/English billing query.'),
});

export const ParseTransactionOutputSchema = z.object({
  phone: z.string().optional(),
  customer_name: z.string().default('Customer'),
  amount: z.number(),
  items: z.string(),
  type: z.enum(['credit', 'payment']),
  confidence_score: z.number(),
});

// ==================================================
// Vyapar AI (Growth & Trends)
// ==================================================
export const MarketTrendInputSchema = z.object({
  product: z.string(),
  region: z.string(),
});

export const MarketTrendOutputSchema = z.object({
  demand_score: z.number(),
  trend_direction: z.enum(['up', 'down', 'stable']),
  trend_duration_days: z.number(),
  seasonal_factor: z.number(),
});

// ==================================================
// Agent Orchestration
// ==================================================
export const AgentInputSchema = z.object({
  query: z.string(),
  shopContext: ShopContextSchema,
});

export const AgentOutputSchema = z.object({
  intent: SupportedIntentSchema,
  confidence: z.number(),
  response: z.string().optional(),
  action: z.object({
    type: z.string(),
    payload: z.any(),
  }).optional(),
  escalate: z.boolean().default(false),
});

export type ShopContext = z.infer<typeof ShopContextSchema>;
export type AgentOutput = z.infer<typeof AgentOutputSchema>;
export type ParseTransactionOutput = z.infer<typeof ParseTransactionOutputSchema>;


export const OrchestratorInputSchema = z.object({
  message: z.string(),
  userId: z.string(),
});

export const OrchestratorOutputSchema = z.object({
  summary: z.string(),
  recommendations: z.array(z.string()).default([]),
  riskFlags: z.array(z.string()).default([]),
  nextActions: z.array(z.string()).default([]),
});

export type AgentInput = z.infer<typeof AgentInputSchema>;
export type SupportedIntent = z.infer<typeof SupportedIntentSchema>;
export type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>;
export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;
