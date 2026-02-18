
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Shop } from '@/docs/backend-types';
import type { ShopContext } from '@/ai/schemas';

interface LoadContextResult {
  success: boolean;
  shop?: Shop;
  shopContext?: ShopContext;
  message?: string;
}

/**
 * Loads the full context for a specific shop based on its unique shop code (document ID).
 * This is a critical service that isolates data per shop in a single-master-number environment.
 * @param shopCode - The unique ID of the shop (e.g., from a parsed #SHP123 code).
 * @returns An object containing the shop data, AI context, or an error message.
 */
export async function loadShopAndContextByShopCode(shopCode: string): Promise<LoadContextResult> {
  console.log(`[ContextLoader] Loading context for Shop Code: ${shopCode}`);
  
  if (!shopCode) {
    return { success: false, message: 'Shop code is missing.' };
  }

  try {
    const shopRef = adminDb.collection('shops').doc(shopCode);
    const shopDoc = await shopRef.get();

    if (!shopDoc.exists) {
      console.warn(`[ContextLoader] No shop found with code: ${shopCode}`);
      return { success: false, message: 'Shop not found for this code.' };
    }

    const shopData = shopDoc.data() as Shop;

    // TODO: In a real system, product catalogs would be loaded from a separate collection.
    // For now, we simulate a simple catalog.
    const productCatalog = "Doodh ₹55/liter, Aata ₹40/kg, Chawal ₹50/kg, Cheeni ₹42/kg";
    
    // Build timing string from settings if available
    let timingsString = 'Subah 9 baje se raat 10 baje tak'; // Default
    if (shopData.settings?.working_hours?.start && shopData.settings?.working_hours?.end) {
        timingsString = `Subah ${shopData.settings.working_hours.start} se raat ${shopData.settings.working_hours.end} tak`;
    }

    // Build the ShopContext object required by the AI agent
    const shopContext: ShopContext = {
      shop_id: shopDoc.id,
      name: shopData.name,
      region: shopData.city || 'Mumbai', // Default region for trend analysis
      paymentModes: ['UPI', 'Cash'], // TODO: Make this configurable in shop settings
      timings: timingsString,
      known_products_and_prices: productCatalog,
      rules: {
        credit_limit_per_transaction: shopData.settings?.credit_limit_per_transaction ?? 5000,
        allow_credit: shopData.settings?.allow_credit ?? true,
      },
    };
    
    console.log(`[ContextLoader] Successfully loaded context for shop: ${shopData.name} (${shopDoc.id})`);
    return { success: true, shop: shopData, shopContext };

  } catch (error) {
    console.error(`[ContextLoader] Error fetching shop from Firestore for code ${shopCode}:`, error);
    return { success: false, message: 'Database query failed.' };
  }
}
