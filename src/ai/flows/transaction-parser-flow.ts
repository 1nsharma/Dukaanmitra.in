'use server';

/**
 * @fileOverview Parses natural language transaction strings into structured data.
 *
 * - parseTransaction - A function to parse a Hinglish transaction query.
 * - ParseTransactionInput - The input type for the parseTransaction function.
 * - ParseTransactionOutput - The return type for the parseTransaction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ParseTransactionInputSchema = z.object({
  query: z.string().describe('The natural language transaction query from the user.'),
});
export type ParseTransactionInput = z.infer<typeof ParseTransactionInputSchema>;

const ParseTransactionOutputSchema = z.object({
  customer_name: z.string().describe("The name of the customer. If no name is found, defaults to 'Customer'."),
  amount: z.number().describe('The transaction amount as an integer.'),
  items: z.string().describe('A string listing the items involved in the transaction.'),
  type: z.enum(['CREDIT', 'PAYMENT']).describe('The type of transaction: CREDIT (udhaar) or PAYMENT (jama).'),
  confidence_score: z.number().min(0).max(1).describe('The AI model\'s confidence in the accuracy of the parsed data.'),
});
export type ParseTransactionOutput = z.infer<typeof ParseTransactionOutputSchema>;

export async function parseTransaction(input: ParseTransactionInput): Promise<ParseTransactionOutput> {
  return transactionParserFlow(input);
}

const transactionParserPrompt = ai.definePrompt({
  name: 'transactionParserPrompt',
  input: { schema: ParseTransactionInputSchema },
  output: { schema: ParseTransactionOutputSchema },
  prompt: `Role: Indian Kirana Billing Expert.
Task: Extract billing info from Hinglish/Local retail slang WhatsApp messages.

Classification Rules:
- "Udhaar", "Baaki", "Likhlena", "Credit", "Udari" -> Action: "CREDIT"
- "Jama", "Diya", "Received", "Paid", "Naga", "Payment" -> Action: "PAYMENT"

Input Examples:
- "Dudh 50" -> { "customer_name": "Customer", "amount": 50, "items": "Doodh", "type": "CREDIT", "confidence_score": 0.95 }
- "Pappu 120 sabji jama" -> { "customer_name": "Pappu", "amount": 120, "items": "Sabji", "type": "PAYMENT", "confidence_score": 0.98 }
- "Rahul ne 200 ka tel liya" -> { "customer_name": "Rahul", "amount": 200, "items": "Tel", "type": "CREDIT", "confidence_score": 0.97 }
- "Ramesh paid 150" -> { "customer_name": "Ramesh", "amount": 150, "items": "Unknown", "type": "PAYMENT", "confidence_score": 0.96 }

Constraint:
- Return STRICT valid JSON only.
- Output Fields: customer_name, amount (Integer), items (String), type (CREDIT/PAYMENT), confidence_score (0-1).
- If no customer name is mentioned, use "Customer".
- If no items are mentioned, use "Unknown".

Here is the user query to parse:
{{query}}
`,
});

const transactionParserFlow = ai.defineFlow(
  {
    name: 'transactionParserFlow',
    inputSchema: ParseTransactionInputSchema,
    outputSchema: ParseTransactionOutputSchema,
  },
  async input => {
    const { output } = await transactionParserPrompt(input);
    return output!;
  }
);
