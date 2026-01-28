'use server';

/**
 * @fileOverview Provides an AI-powered analysis of retail operations.
 *
 * - generateRetailInsights - A function to generate insights from shop data.
 * - RetailInsightsInput - The input type for the generateRetailInsights function.
 * - RetailInsightsOutput - The return type for the generateRetailInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Bill, Customer } from '@/docs/backend-types';

const BillSchema = z.object({
    amount: z.number(),
    created_at: z.any().describe("Timestamp of the bill"),
    customer_name: z.string().optional(),
    items: z.array(z.object({ name: z.string(), quantity: z.number(), price: z.number() })).optional(),
});

const CustomerSchema = z.object({
    name: z.string().optional(),
    visit_count: z.number().optional(),
    total_spent: z.number().optional(),
    last_visit: z.any().describe("Timestamp of last visit"),
    status: z.string().optional(),
});

const RetailInsightsInputSchema = z.object({
  bills: z.array(BillSchema).describe("List of bills from the last 30 days."),
  customers: z.array(CustomerSchema).describe("List of all customers."),
});
export type RetailInsightsInput = z.infer<typeof RetailInsightsInputSchema>;

const RetailInsightsOutputSchema = z.object({
  keyActionItems: z.array(z.string()).describe("A list of 3 clear, actionable items for the shop owner in simple Hinglish."),
  customerInsights: z.string().describe("Insights about customer behavior (e.g., repeat vs one-time, churn signals). Simple Hinglish, no jargon."),
  fastMovingItems: z.string().describe("Analysis of fast-moving items. Simple Hinglish, no jargon."),
  operationalInefficiencies: z.string().describe("Analysis of operational inefficiencies. Simple Hinglish, no jargon."),
  revenueLeakage: z.string().describe("Analysis of potential revenue leakage. Simple Hinglish, no jargon."),
});
export type RetailInsightsOutput = z.infer<typeof RetailInsightsOutputSchema>;

export async function generateRetailInsights(input: { bills: Bill[], customers: Customer[] }): Promise<RetailInsightsOutput> {
  const flowInput: RetailInsightsInput = {
    bills: input.bills.map(b => ({
        amount: b.amount,
        created_at: b.created_at,
        customer_name: b.customer_name,
        items: b.items,
    })),
    customers: input.customers.map(c => ({
        name: c.name,
        visit_count: c.visit_count,
        total_spent: c.total_spent,
        last_visit: c.last_visit,
        status: c.status,
    })),
  }
  return retailInsightsFlow(flowInput);
}

const retailInsightsPrompt = ai.definePrompt({
  name: 'retailInsightsPrompt',
  input: { schema: RetailInsightsInputSchema },
  output: { schema: RetailInsightsOutputSchema },
  prompt: `
    You are a retail operations analyst for DukaanMitra, advising a Kirana store owner in India.
    Your analysis should be in simple Hinglish, without any corporate jargon. Be direct and action-oriented.
    Analyze the provided shop data from the last 30 days (bills and customer lists).

    Your tasks are:
    1. Give 3 clear, top-priority action items for the owner to grow their business. These should be very specific.
    2. Analyze customer behavior, highlighting repeat vs. one-time buyers and potential churn signals.
    3. Highlight fast-moving items and suggest how to capitalize on them.
    4. Identify operational inefficiencies.
    5. Detect potential revenue leakage.

    Here is the data:
    Bills:
    {{{json bills}}}

    Customers:
    {{{json customers}}}

    Provide your full analysis in the requested JSON format. The most important part is the 'keyActionItems'.
  `,
});

const retailInsightsFlow = ai.defineFlow(
  {
    name: 'retailInsightsFlow',
    inputSchema: RetailInsightsInputSchema,
    outputSchema: RetailInsightsOutputSchema,
  },
  async input => {
    const { output } = await retailInsightsPrompt(input);
    return output!;
  }
);
