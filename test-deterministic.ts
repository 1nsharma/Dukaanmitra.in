
import { DeterministicAgent } from './src/ai/free/deterministic-agent.ts';

async function test() {
  const input = {
    query: "Namaste",
    shopContext: {
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
    }
  };
  const result = await DeterministicAgent.process(input);
  console.log("Deterministic Result:", JSON.stringify(result, null, 2));
}

test();
