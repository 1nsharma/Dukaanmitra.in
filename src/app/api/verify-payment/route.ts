
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/lib/firebase-admin';
import { addMonths } from 'date-fns';

const { RAZORPAY_WEBHOOK_SECRET } = process.env;

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

      // Initialize Firebase Admin
      await initializeAdminApp();
      const firestore = getFirestore();

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
            return;
        }
        
        const shopRef = firestore.collection('shops').doc(shopId);

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
          paid_till: addMonths(new Date(), 1),
          updated_at: new Date(),
        });
      });
      
      console.log(`Successfully processed payment for Shop ID: ${shopId}`);
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
    
  } catch (error: any) {
    console.error('[/api/verify-payment] Webhook Error:', error);
    return NextResponse.json({ message: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
