
/**
 * @fileOverview The core DukaanMitra AI Agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { parseTransaction } from './transaction-parser-flow';
import { getMarketTrend } from './market-trend-flow';
import { 
    AgentInputSchema,
    AgentOutputSchema,
    MarketTrendInputSchema,
    MarketTrendOutputSchema,
    ParseTransactionOutputSchema,
    ShopContextSchema,
    SupportedIntentSchema,
    type AgentInput,
    type AgentOutput,
    type ParseTransactionOutput,
    type ShopContext,
    type SupportedIntent,
} from '@/ai/schemas';

/**
 * Wrapper function for the AI agent flow.
 */
export async function runWhatsappAgent(input: AgentInput): Promise<AgentOutput> {
  return anigravityAgent(input);
}

// Internal Tools
const ledgerEntryTool = ai.defineTool(
  {
    name: 'createLedgerEntry',
    description: 'Use this to parse a credit (udhaar) or payment (jama) transaction.',
    inputSchema: z.object({ 
        naturalLanguageQuery: z.string().describe('The user\'s message containing transaction details.')
    }),
    outputSchema: ParseTransactionOutputSchema,
  },
  async ({ naturalLanguageQuery }) => {
    return parseTransaction({ query: naturalLanguageQuery });
  }
);

const marketTrendTool = ai.defineTool(
    {
        name: 'getMarketTrend',
        description: 'Use this to get market trend data.',
        inputSchema: MarketTrendInputSchema,
        outputSchema: MarketTrendOutputSchema,
    },
    async (input) => {
        return getMarketTrend(input);
    }
);

/**
 * Policy Guard: Validates actions against business rules.
 */
function policyGuard(
  intent: SupportedIntent,
  transactionDetails: ParseTransactionOutput | null,
  shopContext: ShopContext
): { allowed: boolean; reason: string } {
  if (intent === 'ledger_entry' && transactionDetails?.type === 'credit') {
    if (!shopContext.rules.allow_credit) {
      return { allowed: false, reason: "Maaf kijiye, yeh dukaan udhaar nahi deti." };
    }
    if (transactionDetails.amount > shopContext.rules.credit_limit_per_transaction) {
      return { allowed: false, reason: `Udhaar ki rakam dukaan ki limit se zyada hai.` };
    }
  }
  return { allowed: true, reason: "" };
}

import { AgentTrainer } from '../training/agent-trainer';

const baseSystemPrompt = `You are DukaanMitra, an AI assistant for a Kirana store.
    Your goal: Understand customer messages and decide on actions.
    
    RESPONSE RULES:
    1. Greeting: Hello/Namaste.
    2. Shop Info: Use context.
    3. Ledger Entry: MUST use 'createLedgerEntry' tool.
    
    SAFETY & ESCALATION:
    - Confidence < 80%? Set 'escalate' to true.`;

const trainedSystemPrompt = AgentTrainer.generateSpecializedPrompt(baseSystemPrompt, 'product-marketing-context.md');

const anigravityAgentPrompt = ai.definePrompt({
    name: 'anigravityAgentPrompt',
    tools: [ledgerEntryTool, marketTrendTool],
    input: { schema: AgentInputSchema },
    output: { schema: AgentOutputSchema },
    system: trainedSystemPrompt,
});

/**
 * Main AI Agent Flow.
 */
export const anigravityAgent = ai.defineFlow(
  {
    name: 'anigravityAgent',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input): Promise<AgentOutput> => {
    const llmResponse = await anigravityAgentPrompt(input);
    const agentDecision = llmResponse.output;

    if (!agentDecision) {
      return {
        intent: 'unknown',
        confidence: 0,
        escalate: true,
        response: 'Sorry, I am having trouble understanding.',
      };
    }
    
    let transactionDetails: ParseTransactionOutput | null = null;
    if (agentDecision.action && agentDecision.action.type === 'ADD_LEDGER_ENTRY') {
        transactionDetails = agentDecision.action.payload.transaction as ParseTransactionOutput;
    }
    
    const policyCheck = policyGuard(agentDecision.intent, transactionDetails, input.shopContext);
    if (!policyCheck.allowed) {
      return {
        intent: agentDecision.intent,
        confidence: 1.0,
        escalate: true,
        response: policyCheck.reason,
        action: undefined,
      };
    }

    return agentDecision;
  }
);


export type { AgentInput, AgentOutput, SupportedIntent };
