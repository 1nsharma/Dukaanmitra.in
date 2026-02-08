'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/interactive-ai-demo.ts';
import '@/ai/flows/retail-insights-flow.ts';
import '@/ai/flows/transaction-parser-flow.ts';
import '@/ai/flows/whatsapp-agent-flow.ts';
import '@/ai/flows/market-trend-flow.ts';
