
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Platform-wide metrics aggregator.
 * Calculates MRR, shop counts, and conversion rates.
 */
const metricsAggregatorFlow = ai.defineFlow(
  {
    name: 'metricsAggregatorFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      success: z.boolean(),
      shopsProcessed: z.number(),
    }),
  },
  async () => {
    console.log('[MetricsAggregator] Starting aggregation...');
    
    const shopsSnapshot = await adminDb.collection('shops').get();
    
    let totalMrr = 0;
    let activeSubscriptions = 0;
    let activeTrials = 0;
    let churnedShops = 0;
    let totalShops = shopsSnapshot.size;

    shopsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'active') activeSubscriptions++;
      if (data.status === 'trial') activeTrials++;
      if (data.status === 'cancelled') churnedShops++;
      if (data.mrr) totalMrr += data.mrr;
    });

    const conversionRate = activeSubscriptions > 0 
        ? (activeSubscriptions / (activeSubscriptions + activeTrials)) * 100 
        : 0;

    const metricsDoc = adminDb.collection('metrics').doc('global');
    await metricsDoc.set({
      id: 'global',
      version: 1, // Schema versioning
      mrr: totalMrr,
      activeSubscriptions,
      activeTrials,
      churnedShops,
      totalShops,
      trialToPaidConversionRate: conversionRate,
      updatedAt: FieldValue.serverTimestamp(),
      calculatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, shopsProcessed: totalShops };
  }
);

export async function runGlobalMetrics() {
    return metricsAggregatorFlow();
}
