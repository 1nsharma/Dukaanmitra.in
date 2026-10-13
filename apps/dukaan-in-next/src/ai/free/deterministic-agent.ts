
import { AgentInput, AgentOutput, ParseTransactionOutput } from '../schemas';

/**
 * DeterministicAgent: A model-free agent that uses heuristics and patterns
 * to process common Kirana store requests.
 * This saves costs and provides instant responses for standard queries.
 */
export class DeterministicAgent {
  private static CREDIT_KEYWORDS = /\b(udhaar|baaki|likh|likhlena|credit|de-baaki|khata|paisa-baaki)\b/i;
  private static PAYMENT_KEYWORDS = /\b(paid|jama|diya|payment|dhila|upas|clear|hisaab-saaf)\b/i;
  private static GREETING_KEYWORDS = /\b(hello|hi|namaste|pranam|ram ram|shubh prabhat|good morning)\b/i;

  public static async process(input: AgentInput): Promise<AgentOutput | null> {
    const { query, shopContext } = input;
    const cleanQuery = query.toLowerCase().trim();

    // 1. Handle Greetings
    if (this.GREETING_KEYWORDS.test(cleanQuery) && cleanQuery.length < 15) {
      return {
        intent: 'greeting',
        confidence: 1.0,
        response: `Namaste! 🙏 Main DukaanMitra hoon, ${shopContext.name} ka digital munim. Kaise madad karu?`,
        escalate: false
      };
    }

    // 2. Handle Simple Ledger Entries (Credit/Payment)
    const transaction = this.parseTransactionHeuristic(cleanQuery);
    if (transaction) {
      return {
        intent: 'ledger_entry',
        confidence: 0.95,
        response: `Ji Namaste 🙏\n\n₹${transaction.amount} ${transaction.type === 'payment' ? 'jama' : 'udhaar'} record ho gaya hai. ✅`,
        action: {
          type: 'ADD_LEDGER_ENTRY',
          payload: {
            transaction: {
              ...transaction,
              confidence_score: 0.95,
              customer_name: 'Customer' // Simplified for deterministic path
            }
          }
        },
        escalate: false
      };
    }

    // 3. Handle Price/Info Queries if keywords match exactly (Simple dictionary)
    // This could be expanded with a small local dictionary or shopContext info

    return null; // Fallback to AI if no deterministic match
  }

  private static parseTransactionHeuristic(text: string): Partial<ParseTransactionOutput> | null {
    const isCredit = this.CREDIT_KEYWORDS.test(text);
    const isPayment = this.PAYMENT_KEYWORDS.test(text);

    if (!isCredit && !isPayment) return null;

    // Pattern: [Amount] [Item/Reason] or [Item/Reason] [Amount]
    const amountMatch = text.match(/(\d+\.?\d*)/);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1]);
      // Extract items by removing amount and keywords
      let items = text
        .replace(amountMatch[0], '')
        .replace(this.CREDIT_KEYWORDS, '')
        .replace(this.PAYMENT_KEYWORDS, '')
        .trim();
      
      if (!items) {
        items = isPayment ? 'Payment Received' : 'General Bill';
      }

      return {
        amount,
        items,
        type: isPayment ? 'payment' : 'credit'
      };
    }

    return null;
  }
}
