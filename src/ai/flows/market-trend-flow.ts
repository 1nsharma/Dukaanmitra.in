
'use server';

/**
 * @fileOverview A tool to fetch market trend data for a given product and region.
 *
 * In a real implementation, this would connect to a data pipeline (e.g., Google Trends API + caching).
 * For now, it returns mock data to simulate the functionality.
 */

import { ai } from '@/ai/genkit';
import { MarketTrendInputSchema, type MarketTrendInput, MarketTrendOutputSchema, type MarketTrendOutput } from '@/ai/schemas';

// This is the main function the agent will call.
export async function getMarketTrend(input: MarketTrendInput): Promise<MarketTrendOutput> {
  return marketTrendFlow(input);
}

const marketTrendFlow = ai.defineFlow(
  {
    name: 'marketTrendFlow',
    inputSchema: MarketTrendInputSchema,
    outputSchema: MarketTrendOutputSchema,
  },
  async (input) => {
    // --- MOCK IMPLEMENTATION ---
    // In a real system, this would call Google Trends API, a database, or a cached result.
    
    const productLower = input.product.toLowerCase();
    
    // Mock logic based on product name
    if (productLower.includes('umbrella') || productLower.includes('raincoat')) {
      return {
        demand_score: 85,
        trend_direction: 'up',
        trend_duration_days: 15,
        seasonal_factor: 0.9,
      };
    }
    if (productLower.includes('mango')) {
      return {
        demand_score: 92,
        trend_direction: 'up',
        trend_duration_days: 45,
        seasonal_factor: 0.95,
      };
    }
     if (productLower.includes('heater') || productLower.includes('ghee')) {
      return {
        demand_score: 30,
        trend_direction: 'down',
        trend_duration_days: 60,
        seasonal_factor: 0.8,
      };
    }
    
    // Default mock response
    return {
      demand_score: 55,
      trend_direction: 'stable',
      trend_duration_days: 30,
      seasonal_factor: 0.2,
    };
  }
);
