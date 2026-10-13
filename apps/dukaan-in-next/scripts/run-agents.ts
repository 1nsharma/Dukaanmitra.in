
import { Orchestrator, AgentTrainer } from '../src/ai/index.ts';

/**
 * Demo Script: Putting the trained agents to work.
 * Demonstrates model-free deterministic parsing vs AI fallback.
 */
async function main() {
  console.log("🚀 Initializing DukaanMitra Agent Workforce...");

  // 1. Train the agent
  await AgentTrainer.trainAgent('mitra-v1', ['product-marketing-context.md']);

  const dummyShopContext = {
    shop_id: 'DEMO123',
    name: 'Apna Bazar',
    region: 'Delhi',
    paymentModes: ['UPI', 'Cash'],
    timings: '9 AM - 9 PM',
    known_products_and_prices: 'Milk: 60, Bread: 40',
    rules: {
      credit_limit_per_transaction: 1000,
      allow_credit: true
    }
  };

  const testQueries = [
    "Namaste", // Should be handled by DeterministicAgent (Greeting)
    "Rahul 500 udhaar", // Should be handled by DeterministicAgent (Ledger)
    "What are the best features of DukaanMitra?", // Should fallback to Trained AI (Knowledge)
  ];

  for (const query of testQueries) {
    console.log(`\n--- Query: "${query}" ---`);
    const result = await Orchestrator.execute({
      query,
      shopContext: dummyShopContext
    });
    console.log(`Response: ${result.response}`);
    console.log(`Intent: ${result.intent}`);
  }
}

main().catch(console.error);
