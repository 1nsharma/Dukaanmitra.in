
/**
 * @fileOverview A tool to fetch market trend data for a given product and region.
 *
 * In a real implementation, this would connect to a data pipeline (e.g., Google Trends API + caching).
 * For now, it returns mock data to simulate the functionality.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const MarketTrendInputSchema = z.object({
  product: z.string().describe('The product to check the trend for, e.g., "Mangoes", "Umbrellas".'),
  region: z.string().describe('The region for the trend, e.g., "Delhi", "Mumbai".'),
});
export type MarketTrendInput = z.infer<typeof MarketTrendInputSchema>;

export const MarketTrendOutputSchema = z.object({
  demand_score: z.number().min(0).max(100).describe('A score from 0-100 indicating current market demand.'),
  trend_direction: z.enum(['up', 'down', 'stable']).describe('The recent direction of the demand trend.'),
  trend_duration_days: z.number().describe('The number of days the current trend has been active.'),
  seasonal_factor: z.number().min(0).max(1).describe('A score from 0-1 indicating how much the trend is influenced by seasonality.'),
});
export type MarketTrendOutput = z.infer<typeof MarketTrendOutputSchema>;

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
  async (input): Promise<MarketTrendOutput> => {
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
