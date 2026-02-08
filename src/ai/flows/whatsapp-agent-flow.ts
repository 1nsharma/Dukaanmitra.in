
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
import { parseTransaction } from './transaction-parser-flow';
import { getMarketTrend } from './market-trend-flow';

// ==================================================
// 1. INTENT DEFINITION & DETECTION
// ==================================================
const SupportedIntentSchema = z.enum([
  'price_query',
  'availability_query',
  'payment_query',
  'order_create',
  'order_cancel',
  'ledger_entry', // Handled by a specialized tool
  'shop_timing',
  'trend_related_question',
  'greeting',
  'unknown',
]);
type SupportedIntent = z.infer<typeof SupportedIntentSchema>;

const IntentDetectionOutputSchema = z.object({
  intent: SupportedIntentSchema,
  entities: z.object({
    product: z.string().optional(),
  }).optional(),
  confidence: z.number().min(0).max(1),
});

/**
 * Anigravity Tool: detect_intent
 * Uses a hybrid approach: a rule-based parser for high-value intents (ledger)
 * and an LLM for general classification.
 */
const detectIntentPrompt = ai.definePrompt({
  name: 'detectIntentPrompt',
  input: { schema: z.object({ query: z.string() }) },
  output: { schema: IntentDetectionOutputSchema },
  prompt: `You are an expert intent classifier for an Indian Kirana store's WhatsApp agent.
    Analyze the user's message and classify it into ONE of the following intents. Provide a confidence score.
    Extract the main product entity if present.

    Intents:
    - price_query: Asking for the price of an item. (e.g., "dudh ka rate kya hai?", "how much for 1kg sugar?")
    - availability_query: Asking if an item is in stock. (e.g., "atta hai kya?", "do you have bread?")
    - payment_query: Asking about payment methods. (e.g., "upi chalta hai?", "cash loge?")
    - order_create: Placing a new order. (e.g., "2 bread packet bhej do", "1 maggi, 2 milk")
    - order_cancel: Cancelling a previous order. (e.g., "mera order cancel kar do")
    - shop_timing: Asking for shop opening or closing times. (e.g., "kab tak khuli hai?", "what time do you open?")
    - trend_related_question: Asking about market trends or popular items. (e.g., "aaj kal kya chal raha hai?", "which product is in demand in Mumbai?")
    - greeting: A simple greeting. (e.g., "hello", "namaste")
    - unknown: Anything that doesn't fit.

    User Message: "{{query}}"

    Output only the JSON object.
    `,
});

// ==================================================
// 2. SHOP CONTEXT & POLICY GUARD
// ==================================================
const ShopContextSchema = z.object({
  shop_id: z.string(),
  name: z.string(),
  region: z.string().default('Mumbai'), // For trend analysis
  paymentModes: z.array(z.string()),
  timings: z.string(),
  // For simplicity, a string. A real system would use a structured product catalog.
  known_products_and_prices: z.string().describe("Simple string of known products and prices, e.g., 'Doodh ₹55/liter, Aata ₹40/kg'"),
  rules: z.object({
    credit_limit_per_transaction: z.number().default(5000),
    allow_credit: z.boolean().default(true),
  }),
});
export type ShopContext = z.infer<typeof ShopContextSchema>;

/**
 * Anigravity Tool: policy_guard
 * A synchronous function that enforces business rules before executing actions.
 */
function policyGuard(
  intent: SupportedIntent,
  transactionDetails: any | null,
  shopContext: ShopContext
): { allowed: boolean; reason: string } {
  if (intent === 'ledger_entry' && transactionDetails?.type === 'credit') {
    if (!shopContext.rules.allow_credit) {
      return { allowed: false, reason: "Sorry, this shop does not offer credit." };
    }
    if (transactionDetails.amount > shopContext.rules.credit_limit_per_transaction) {
      return { allowed: false, reason: `Credit amount ₹${transactionDetails.amount} is over the shop's limit of ₹${shopContext.rules.credit_limit_per_transaction}.` };
    }
  }
  return { allowed: true, reason: "" };
}

// ==================================================
// 3. AGENT INPUT / OUTPUT (EXTERNAL INTERFACE)
// ==================================================
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
// 4. THE CORE ANIGRAVITY AGENT FLOW
// ==================================================
export const anigravityAgent = ai.defineFlow(
  {
    name: 'anigravityAgent',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {

    // --------------------------------------------------
    // FLOW STEP 1: DETECT INTENT (Rule-first, LLM fallback)
    // --------------------------------------------------
    let intentResult: z.infer<typeof IntentDetectionOutputSchema>;
    let transactionDetails: any = null;
    
    // Rule-based check for high-value `ledger_entry` intent.
    if (input.query.match(/\d/)) { // Simple rule: if there's a number, it *might* be a transaction.
      try {
        const parsedTransaction = await parseTransaction({ query: input.query });
        if (parsedTransaction.confidence_score > 0.85) {
          intentResult = { intent: 'ledger_entry', confidence: parsedTransaction.confidence_score, entities: { product: parsedTransaction.items } };
          transactionDetails = parsedTransaction;
        } else {
          // Confidence is low, fall back to general LLM classifier.
          const { output } = await detectIntentPrompt({ query: input.query });
          if (!output) throw new Error("Intent detection failed.");
          intentResult = output;
        }
      } catch (e) {
        // Parsing failed, fall back to general LLM classifier.
        const { output } = await detectIntentPrompt({ query: input.query });
        if (!output) throw new Error("Intent detection failed.");
        intentResult = output;
      }
    } else {
      // No numbers, unlikely to be a ledger entry, use general LLM classifier.
      const { output } = await detectIntentPrompt({ query: input.query });
      if (!output) throw new Error("Intent detection failed.");
      intentResult = output;
    }
    
    const { intent, confidence, entities } = intentResult;

    // --------------------------------------------------
    // FLOW STEP 2: LOAD SHOP CONTEXT (Passed as input)
    // --------------------------------------------------
    const shopContext = input.shopContext;

    // --------------------------------------------------
    // FLOW STEP 3: POLICY GUARD
    // --------------------------------------------------
    const policyCheck = policyGuard(intent, transactionDetails, shopContext);
    if (!policyCheck.allowed) {
      return {
        intent,
        confidence: 1.0,
        escalate: true, // Escalate because a policy was violated.
        escalation_reason: `Policy Violation: ${policyCheck.reason}`,
        response: policyCheck.reason, // Inform the user of the specific reason.
      };
    }

    // --------------------------------------------------
    // FLOW STEP 4: GET MARKET TREND (Conditional)
    // --------------------------------------------------
    let trendInfo: any = null;
    if (intent === 'trend_related_question' && entities?.product) {
        try {
            trendInfo = await getMarketTrend({ product: entities.product, region: shopContext.region });
        } catch (e) {
            console.warn("Market trend tool failed, proceeding without trend data.");
            // Failsafe: Continue safely without trend data.
        }
    }

    // --------------------------------------------------
    // FLOW STEP 5 & 6: DECISION ROUTER + EXECUTE/REPLY
    // --------------------------------------------------

    // FAILSAFE: Low confidence check
    if (confidence < 0.75 && intent !== 'ledger_entry') { // Ledger entry has its own confidence check
      return {
        intent,
        confidence,
        escalate: true,
        escalation_reason: `Low confidence score: ${confidence.toFixed(2)}`,
        response: "Iske liye shopkeeper se confirm karna hoga.",
      };
    }

    switch (intent) {
      case 'ledger_entry':
        // This intent passed the policy guard. It's an executable action.
        return {
          intent,
          confidence,
          escalate: false,
          action: { type: 'ADD_LEDGER_ENTRY', payload: transactionDetails },
          response: `Theek hai, ${transactionDetails.customer_name} ka hisaab (₹${transactionDetails.amount}) note kar liya hai. 👍`,
        };

      case 'greeting':
        return {
          intent, confidence, escalate: false,
          response: `Namaste! ${shopContext.name} me swagat hai. Batayein kya chahiye?`,
        };

      case 'payment_query':
        return {
          intent, confidence, escalate: false,
          response: `Hum ${shopContext.paymentModes.join(' aur ')} accept karte hain.`,
        };

      case 'shop_timing':
        return {
          intent, confidence, escalate: false,
          response: `Dukaan ${shopContext.timings} khuli rehti hai.`,
        };
      
      case 'trend_related_question':
        let trendResponse = "Iske baare me abhi jaankari nahi hai.";
        if (trendInfo) {
            trendResponse = `Abhi ${entities?.product} ka trend '${trendInfo.trend_direction}' hai aur demand score ${trendInfo.demand_score}/100 hai.`;
        }
        return {
            intent, confidence, escalate: false,
            response: trendResponse
        };

      case 'price_query':
        if (entities?.product) {
          const product = entities.product.toLowerCase();
          const prices = shopContext.known_products_and_prices.toLowerCase();
          
          const productIndex = prices.indexOf(product);
          if (productIndex !== -1) {
            const searchString = prices.substring(productIndex);
            const priceMatch = searchString.match(/₹\s*(\d+(\.\d+)?)/);
            if (priceMatch) {
              return {
                intent, confidence, escalate: false,
                response: `${entities.product} ka rate ${priceMatch[0]} hai.`,
              };
            }
          }
        }
        return {
          intent, confidence, escalate: true,
          escalation_reason: `Price for '${entities?.product}' not found in catalog.`,
          response: `Iske liye shopkeeper se confirm karna padega ki ${entities?.product || 'is item'} ka rate kya hai.`,
        };
        
      case 'availability_query':
        if (entities?.product) {
          const product = entities.product.toLowerCase();
          const catalog = shopContext.known_products_and_prices.toLowerCase();
          if (catalog.includes(product)) {
            return {
              intent, confidence, escalate: false,
              response: `Ji haan, ${entities.product} abhi available hai.`,
            };
          }
        }
        return {
          intent, confidence, escalate: true,
          escalation_reason: `Availability of '${entities?.product}' not found in catalog.`,
          response: `Iske liye shopkeeper se confirm karna padega ki ${entities?.product || 'yeh item'} stock me hai ya nahi.`,
        };

      case 'order_create':
      case 'order_cancel':
      case 'unknown':
      default:
        return {
          intent,
          confidence,
          escalate: true,
          escalation_reason: `Unsupported or unsafe intent: ${intent}`,
          response: "Iske liye shopkeeper se confirm karna hoga.",
        };
    }
  }
);

/**
 * A simple wrapper function to easily call the agent flow.
 * This would be triggered by the WhatsApp webhook infrastructure.
 */
export async function runWhatsappAgent(input: AgentInput): Promise<AgentOutput> {
  return anigravityAgent(input);
}
