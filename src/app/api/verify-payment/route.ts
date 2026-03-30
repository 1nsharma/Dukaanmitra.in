
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import { addMonths, format } from 'date-fns';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';

const { RAZORPAY_WEBHOOK_SECRET } = process.env;

const getPlanDurationMonths = (plan?: string): number => {
  const planDurationMonths: Record<string, number> = {
    basic: 1,
    pro: 1,
  };

  if (!plan) {
    return 1;
  }

  return planDurationMonths[plan] ?? 1;
};

const toDateOrNull = (value: any): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export async function POST(request: NextRequest) {
  const secret = RAZORPAY_WEBHOOK_SECRET!;
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ message: 'Signature missing' }, { status: 400 });
  }

  const rawBody = await request.text();

  try {
    // 1. Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Invalid Razorpay webhook signature received.');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // 2. Handle the 'payment.captured' event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const { shopId, userId, plan } = payment.notes;

      if (!shopId) {
        throw new Error('shopId not found in payment notes');
      }

      // Use the pre-initialized adminDb instance
      const firestore = adminDb;
      
      let shopOwnerPhone = '';
      let shopName = '';
      let updatedExpiryDate: Date | null = null;
      let isDuplicateWebhook = false;

      // 3. Update Firestore in a transaction
      await firestore.runTransaction(async (transaction) => {
        const orderQuery = await firestore.collection('orders')
          .where('razorpayOrderId', '==', razorpayOrderId)
          .limit(1)
          .get();

        if (orderQuery.empty) {
          throw new Error(`Order not found for razorpayOrderId: ${razorpayOrderId}`);
        }
        
        const orderDoc = orderQuery.docs[0];
        // Prevent processing the same webhook twice
        if (orderDoc.data().status === 'paid') {
          console.log(`Order ${orderDoc.id} already marked as paid. Ignoring webhook.`);
          isDuplicateWebhook = true;
          return;
        }
        
        const shopRef = firestore.collection('shops').doc(shopId);
        const shopDoc = await transaction.get(shopRef);
        if (!shopDoc.exists) {
            throw new Error(`Shop with ID ${shopId} not found.`);
        }
        const shopData = shopDoc.data();
        shopOwnerPhone = shopData?.phone;
        shopName = shopData?.name;
        const previousPaidTill = toDateOrNull(shopData?.paid_till);
        const now = new Date();
        const baseDate =
          previousPaidTill && previousPaidTill > now ? previousPaidTill : now;
        const planDurationMonths = getPlanDurationMonths(plan);
        const newExpiryDate = addMonths(baseDate, planDurationMonths);
        updatedExpiryDate = newExpiryDate;


        // Update Order
        transaction.update(orderDoc.ref, {
          status: 'paid',
          paidAt: new Date(),
          razorpayPaymentId: payment.id,
        });

        // Update Shop
        transaction.update(shopRef, {
          status: 'active',
          plan: plan,
          paid_till: newExpiryDate,
          updated_at: new Date(),
        });
        
        // Create an audit log
        const logRef = firestore.collection('logs').doc();
        transaction.set(logRef, {
            id: logRef.id,
            event: 'payment_verified',
            createdAt: new Date(),
            details: {
                shopId,
                userId,
                plan,
                amount: payment.amount / 100,
                razorpayPaymentId: payment.id,
                previousPaidTill: previousPaidTill?.toISOString() ?? null,
                newPaidTill: newExpiryDate.toISOString(),
                message: `Subscription activated for shop ${shopId}. Expiry moved from ${previousPaidTill?.toISOString() ?? 'none'} to ${newExpiryDate.toISOString()}.`
            }
        });
      });

      if (isDuplicateWebhook) {
        return NextResponse.json({ status: 'ok', message: 'Duplicate webhook ignored' }, { status: 200 });
      }

      console.log(`Successfully processed payment for Shop ID: ${shopId}`);

      // 4. Send WhatsApp Confirmation
      if (shopOwnerPhone && updatedExpiryDate) {
        const formattedExpiry = format(updatedExpiryDate, 'dd MMMM yyyy');
        const confirmationMessage = `Namaste ${shopName || ''} 🎉\n\n₹${payment.amount / 100} payment received successfully.\n\nDukaanMitra active till ${formattedExpiry}.\n\nAapka business ab secure hai.`;
        await sendWhatsAppMessage(shopOwnerPhone, confirmationMessage);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
    
  } catch (error: any) {
    console.error('[/api/verify-payment] Webhook Error:', error);
    return NextResponse.json({ message: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
