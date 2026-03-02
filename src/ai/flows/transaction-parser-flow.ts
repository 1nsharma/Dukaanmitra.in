
'use server';

import { ai } from '@/ai/genkit';
import { ParseTransactionInputSchema, ParseTransactionOutputSchema, type ParseTransactionOutput } from '@/ai/schemas';

// Explicitly export for use in components/other flows
export { ParseTransactionOutputSchema };

/**
 * Munim AI: Deterministic-First Billing Parser.
 */
export async function parseTransaction(input: { query: string }): Promise<ParseTransactionOutput> {
  const result = await transactionParserFlow(input);
  return result;
}

const transactionParserFlow = ai.defineFlow(
  {
    name: 'transactionParserFlow',
    inputSchema: ParseTransactionInputSchema,
    outputSchema: ParseTransactionOutputSchema,
  },
  async input => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      input: input.query,
      output: { schema: ParseTransactionOutputSchema },
      system: `You are Munim AI, an expert Indian Kirana accountant.
      Extract: amount, customer_name, items, and type (credit/payment).
      Slang Mapping:
      - Udhaar, Baaki, Likhlena -> credit
      - Jama, Diya, Payment, Paid -> payment`
    });
    return output!;
  }
);
