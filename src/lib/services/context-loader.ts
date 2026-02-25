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
 * Loads the full context for a specific shop based on its unique shop code.
 * This is a critical service that ensures data isolation per shop.
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

    // In a production system, catalogs would be loaded from a 'products' subcollection.
    // For MVP, we use a basic list.
    const productCatalog = shopData.settings?.language === 'hi' 
        ? "दूध ₹55/लीटर, आटा ₹40/किलो, चावल ₹50/किलो"
        : "Doodh ₹55/liter, Aata ₹40/kg, Chawal ₹50/kg, Cheeni ₹42/kg";
    
    let timingsString = 'Subah 9 baje se raat 10 baje tak';
    if (shopData.settings?.working_hours?.start && shopData.settings?.working_hours?.end) {
        timingsString = `Subah ${shopData.settings.working_hours.start} se raat ${shopData.settings.working_hours.end} tak`;
    }

    const shopContext: ShopContext = {
      shop_id: shopDoc.id,
      name: shopData.name,
      region: shopData.city || 'Mumbai',
      paymentModes: ['UPI', 'Cash'],
      timings: timingsString,
      known_products_and_prices: productCatalog,
      rules: {
        credit_limit_per_transaction: shopData.settings?.credit_limit_per_transaction ?? 5000,
        allow_credit: shopData.settings?.allow_credit ?? true,
      },
    };
    
    return { success: true, shop: shopData, shopContext };

  } catch (error) {
    console.error(`[ContextLoader] Error fetching shop context:`, error);
    return { success: false, message: 'Database query failed.' };
  }
}
