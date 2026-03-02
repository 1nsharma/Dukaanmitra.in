
'use server';

/**
 * @fileOverview Parses natural language transaction strings into structured data.
 */

import { ai } from '@/ai/genkit';
import {
  ParseTransactionInputSchema,
  TransactionParserPromptOutputSchema,
  type ParseTransactionInput,
  type ParseTransactionOutput,
} from '@/ai/schemas';

/**
 * Wrapper function for the transaction parser flow.
 * Next.js 15 requires "use server" files to only export async functions.
 */
export async function parseTransaction(input: ParseTransactionInput): Promise<ParseTransactionOutput> {
  const flowResult = await transactionParserFlow(input);
  return {
    ...flowResult,
    type: flowResult.type.toLowerCase() as 'credit' | 'payment'
  };
}

const transactionParserPrompt = ai.definePrompt({
  name: 'transactionParserPrompt',
  input: { schema: ParseTransactionInputSchema },
  output: { schema: TransactionParserPromptOutputSchema },
  prompt: `Role: Indian Kirana Billing Expert.
Task: Extract billing info from Hinglish/Local retail slang WhatsApp messages.

Classification Rules:
- "Udhaar", "Baaki", "Likhlena", "Credit", "Udari" -> Action: "CREDIT"
- "Jama", "Diya", "Received", "Paid", "Naga", "Payment" -> Action: "PAYMENT"

Input Examples:
- "Dudh 50" -> { "customer_name": "Customer", "amount": 50, "items": "Doodh", "type": "CREDIT", "confidence_score": 0.95 }
- "9876543210 Pappu 120 sabji jama" -> { "phone": "9876543210", "customer_name": "Pappu", "amount": 120, "items": "Sabji", "type": "PAYMENT", "confidence_score": 0.98 }
- "Rahul ne 200 ka tel liya" -> { "customer_name": "Rahul", "amount": 200, "items": "Tel", "type": "CREDIT", "confidence_score": 0.97 }

Constraint:
- Return STRICT valid JSON only.
- Output Fields: phone (string, optional 10-digit), customer_name, amount (Integer), items (String), type (CREDIT/PAYMENT), confidence_score (0-1).

Here is the user query to parse:
{{query}}
`,
});

const transactionParserFlow = ai.defineFlow(
  {
    name: 'transactionParserFlow',
    inputSchema: ParseTransactionInputSchema,
    outputSchema: TransactionParserPromptOutputSchema,
  },
  async input => {
    const result = await transactionParserPrompt(input);
    return result.output!;
  }
);
