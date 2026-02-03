'use server';
/**
 * @fileOverview The core AI agent for processing WhatsApp messages.
 * This agent detects intent, loads shop context, and decides whether to reply, act, or escalate.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  parseTransaction,
  ParseTransactionOutput,
} from './transaction-parser-flow';

// 1. INTENT DEFINITION
const SupportedIntentSchema = z.enum([
  'price_query',
  'availability_query',
  'payment_query',
  'order_create',
  'order_cancel',
  'ledger_entry',
  'shop_timing',
  'greeting',
  'unknown',
]);
type SupportedIntent = z.infer<typeof SupportedIntentSchema>;

// 2. SHOP CONTEXT (Placeholder for now)
const ShopContextSchema = z.object({
    name: z.string(),
    // For now, we'll keep this simple. In production, this would be populated
    // with product lists, prices, credit rules, etc.
    data: z.any().describe("A JSON blob of shop-specific data like products, prices, and rules."),
});
export type ShopContext = z.infer<typeof ShopContextSchema>;

// 3. INPUT / OUTPUT DEFINITIONS
export const AgentInputSchema = z.object({
  query: z.string().describe('The raw WhatsApp message from the customer.'),
  shopContext: ShopContextSchema.describe('The context of the specific shop receiving the message.'),
});
export type AgentInput = z.infer<typeof AgentInputSchema>;

export const AgentOutputSchema = z.object({
  intent: SupportedIntentSchema,
  confidence: z.number().min(0).max(1),
  response: z.string().optional().describe("The generated Hinglish response for the customer."),
  action: z.any().optional().describe("A structured object for backend systems to execute, e.g., a ledger entry."),
  escalate: z.boolean().describe("If true, the agent is unsure and is escalating to a human."),
});
export type AgentOutput = z.infer<typeof AgentOutputSchema>;


// 4. THE INTENT DETECTOR PROMPT
const intentDetectorPrompt = ai.definePrompt({
    name: 'intentDetectorPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: z.object({
        intent: SupportedIntentSchema,
        confidence: z.number().min(0).max(1),
    }) },
    prompt: `You are an expert intent classifier for an Indian Kirana store's WhatsApp agent.
    Analyze the user's message and classify it into ONE of the following intents. Provide a confidence score.

    Intents:
    - price_query: Asking for the price of an item. (e.g., "dudh ka rate kya hai?", "how much for 1kg sugar?")
    - availability_query: Asking if an item is in stock. (e.g., "atta hai kya?", "do you have bread?")
    - payment_query: Asking about payment methods. (e.g., "upi chalta hai?", "cash loge?")
    - order_create: Placing a new order. (e.g., "2 bread packet bhej do", "1 maggi, 2 milk")
    - order_cancel: Cancelling a previous order. (e.g., "mera order cancel kar do")
    - ledger_entry: A credit (udhaar) or payment (jama) transaction. (e.g., "Ravi 500 udhaar", "Pappu ne 200 diye")
    - shop_timing: Asking for shop opening or closing times. (e.g., "kab tak khuli hai?", "what time do you open?")
    - greeting: A simple greeting. (e.g., "hello", "namaste")
    - unknown: Anything that doesn't fit the above categories.

    User Message: "{{query}}"

    Output only the JSON object.
    `,
});

// 5. THE MAIN AGENT FLOW
export const whatsappAgentFlow = ai.defineFlow(
  {
    name: 'whatsappAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {
    // Step 1: Detect Intent
    const { output: intentDetection } = await intentDetectorPrompt({ query: input.query });
    if (!intentDetection) {
        return { intent: 'unknown', confidence: 0, escalate: true, response: "Iska jawab shopkeeper denge 🙂" };
    }

    const { intent, confidence } = intentDetection;
    
    // Step 2: Decision Engine - Rule: If confidence is low, escalate.
    if (confidence < 0.75) {
        return { intent, confidence, escalate: true, response: "Iska confirm shopkeeper karega." };
    }

    switch (intent) {
        case 'ledger_entry':
            // Action: Use the specialized transaction parser tool.
            const transactionDetails = await parseTransaction({ query: input.query });
            return {
                intent,
                confidence,
                escalate: false,
                action: { type: 'ADD_LEDGER_ENTRY', details: transactionDetails },
                response: `Theek hai, ${transactionDetails.type === 'credit' ? 'udhaar' : 'payment'} entry for ${transactionDetails.customer_name} (₹${transactionDetails.amount}) add kar diya hai.`
            };
        
        case 'greeting':
            // Reply: Simple greeting using shop context.
            return {
                intent,
                confidence,
                escalate: false,
                response: `Namaste! ${input.shopContext.name} me swagat hai. Batayein kya chahiye?`
            };

        case 'price_query':
             // Escalate: AI is not allowed to hallucinate prices.
            return {
                intent,
                confidence,
                escalate: true, // Escalate because we need to look up data that isn't available yet.
                response: "Iske daam ke liye shopkeeper se confirm karna hoga."
            };
        
        // ... other cases for different intents would be built out here ...

        default:
            // Escalate: If the intent is known but not handled, or unknown.
            return {
                intent,
                confidence,
                escalate: true,
                response: "Iska jawab shopkeeper denge 🙂"
            };
    }
  }
);

/**
 * A wrapper function to easily call the agent flow from other parts of the application.
 * @param input The raw query and shop context.
 * @returns A decision object from the AI agent.
 */
export async function runWhatsappAgent(input: AgentInput): Promise<AgentOutput> {
  return whatsappAgentFlow(input);
}
