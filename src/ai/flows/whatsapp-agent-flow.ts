
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

// 2. SHOP CONTEXT (Defines the data each shop provides)
const ShopContextSchema = z.object({
    name: z.string(),
    paymentModes: z.array(z.string()).describe("List of accepted payment methods, e.g., ['UPI', 'Cash']"),
    timings: z.string().describe("Shop opening and closing times, e.g., 'Subah 9 baje se raat 10 baje tak'"),
    // In a real system, this would be a structured product catalog.
    // For now, it's a simple string for the AI to parse.
    products: z.string().describe("A simple string listing available products and prices, e.g., 'Dudh ₹55/liter, Aata ₹40/kg'"),
    creditLimit: z.number().default(5000).describe("The maximum credit amount allowed for a single transaction."),
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


// 4. THE INTENT DETECTOR PROMPT (LLM Fallback)
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

// 5. THE MAIN AGENT FLOW (DECISION ENGINE)
export const whatsappAgentFlow = ai.defineFlow(
  {
    name: 'whatsappAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {
    // Step 1: High-Confidence Rule-Based Intent Detection (for ledger entries)
    // This is faster and more reliable than the LLM for the most critical action.
    if (input.query.match(/\d/)) { // A simple rule: if there's a number, it might be a transaction.
        try {
            const transactionDetails = await parseTransaction({ query: input.query });
            if (transactionDetails.confidence_score > 0.9) {
                 // Policy Guard: Check credit limit
                if (transactionDetails.type === 'credit' && transactionDetails.amount > input.shopContext.creditLimit) {
                    return {
                        intent: 'ledger_entry',
                        confidence: 1.0,
                        escalate: true,
                        response: `Is amount (₹${transactionDetails.amount}) ke liye shopkeeper confirm karenge.`
                    };
                }
                // Action: The intent is clearly a ledger entry.
                return {
                    intent: 'ledger_entry',
                    confidence: transactionDetails.confidence_score,
                    escalate: false,
                    action: { type: 'ADD_LEDGER_ENTRY', details: transactionDetails },
                    response: `Theek hai, ${transactionDetails.customer_name} ka hisaab (₹${transactionDetails.amount}) note kar liya hai. 👍`
                };
            }
        } catch (e) {
            // Ignore if parsing fails, let the LLM handle it.
        }
    }
    
    // Step 2: LLM Fallback for Intent Detection
    const { output: intentDetection } = await intentDetectorPrompt({ query: input.query });
    if (!intentDetection) {
        return { intent: 'unknown', confidence: 0, escalate: true, response: "Iska jawab shopkeeper denge 🙂" };
    }

    const { intent, confidence } = intentDetection;
    
    // Step 3: Decision Engine - Rule: If confidence is low, escalate.
    if (confidence < 0.75) {
        return { intent, confidence, escalate: true, response: "Iska confirm shopkeeper karega." };
    }
    
    // Step 4: Handle each intent with its own logic and policy guards.
    switch (intent) {
        case 'greeting':
            return {
                intent,
                confidence,
                escalate: false,
                response: `Namaste! ${input.shopContext.name} me swagat hai. Batayein kya chahiye?`
            };
        
        case 'payment_query':
            return {
                intent,
                confidence,
                escalate: false,
                response: `Hum ${input.shopContext.paymentModes.join(' aur ')} accept karte hain.`
            };
            
        case 'shop_timing':
            return {
                intent,
                confidence,
                escalate: false,
                response: `Dukaan ${input.shopContext.timings} khuli rehti hai.`
            };

        // For price and availability, we ESCALATE because the AI is not allowed to hallucinate.
        // A real implementation would involve a database lookup here.
        case 'price_query':
        case 'availability_query':
        case 'order_create':
        case 'order_cancel':
            return {
                intent,
                confidence,
                escalate: true, 
                response: "Iske liye shopkeeper se confirm karna hoga."
            };
        
        // This case is handled by the rule-based check above, but as a fallback, we escalate.
        case 'ledger_entry':
        default:
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
