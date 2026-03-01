
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { format } from 'date-fns';

/**
 * Platform-wide metrics aggregator.
 * Calculates MRR, shop counts, and conversion rates.
 * Writes to /metrics/global for use by SAP dashboard.
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
    console.log('[MetricsAggregator] Starting global aggregation...');
    
    const shopsSnapshot = await adminDb.collection('shops').get();
    const usersSnapshot = await adminDb.collection('users').get();
    
    let totalMrr = 0;
    let activeSubscriptions = 0;
    let activeTrials = 0;
    let churnedShops = 0;
    let totalShops = shopsSnapshot.size;
    let totalUsers = usersSnapshot.size;

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

    const avgRevenue = activeSubscriptions > 0 ? totalMrr / activeSubscriptions : 0;

    const metricsDoc = adminDb.collection('metrics').doc('global');
    await metricsDoc.set({
      id: 'global',
      mrr: totalMrr,
      activeSubscriptions,
      activeTrials,
      churnedShops,
      totalShops,
      totalUsers,
      trialToPaidConversionRate: conversionRate,
      avgRevenuePerShop: avgRevenue,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`[MetricsAggregator] Aggregation complete. MRR: ₹${totalMrr}`);
    return { success: true, shopsProcessed: totalShops };
  }
);

export async function runGlobalMetrics() {
    return metricsAggregatorFlow();
}
