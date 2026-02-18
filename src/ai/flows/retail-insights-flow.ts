
'use server';

/**
 * @fileOverview Provides an AI-powered analysis of retail operations.
 *
 * - generateRetailInsights - A function to generate insights from shop data.
 * - RetailInsightsInput - The input type for the generateRetailInsights function.
 * - RetailInsightsOutput - The return type for the generateRetailInsights function.
 */

import { ai } from '@/ai/genkit';
import type { LedgerEntry, Customer } from '@/docs/backend-types';
import { RetailInsightsInputSchema, type RetailInsightsInput, RetailInsightsOutputSchema, type RetailInsightsOutput } from '@/ai/schemas';

export async function generateRetailInsights(input: { ledgerEntries: LedgerEntry[], customers: Customer[] }): Promise<RetailInsightsOutput> {
  const flowInput: RetailInsightsInput = {
    ledgerEntries: input.ledgerEntries.map(l => ({
        amount: l.amount,
        createdAt: l.createdAt,
        customerName: l.customerName,
        item: l.item,
        type: l.type,
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
    Analyze the provided shop data from the last 30 days (transactions and customer lists).

    Your tasks are:
    1. Give 3 clear, top-priority action items for the owner to grow their business. These should be very specific.
    2. Analyze customer behavior, highlighting repeat vs. one-time buyers and potential churn signals.
    3. Highlight fast-moving items from the 'item' field and suggest how to capitalize on them.
    4. Identify operational inefficiencies based on transaction patterns (e.g., many small credit transactions).
    5. Detect potential revenue leakage (e.g., high credit amounts to new customers).

    Here is the data:
    Transactions:
    {{{json ledgerEntries}}}

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
    const result = await retailInsightsPrompt(input);
    return result.output()!;
  }
);
