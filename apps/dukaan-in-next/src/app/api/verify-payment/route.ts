
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import { addMonths, format } from 'date-fns';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';

export const dynamic = 'force-dynamic';

const { RAZORPAY_WEBHOOK_SECRET } = process.env;

export async function POST(request: NextRequest) {
  const secret = RAZORPAY_WEBHOOK_SECRET!;
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ message: 'Signature missing' }, { status: 400 });
  }

  const rawBody = await request.text();

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const { shopId, plan } = payment.notes;

      if (!shopId) {
        throw new Error('shopId not found in payment notes');
      }

      const firestore = adminDb;
      let shopOwnerPhone = '';
      let shopName = '';
      const newExpiryDate = addMonths(new Date(), 1);

      await firestore.runTransaction(async (transaction) => {
        const orderQuery = await firestore.collection('orders')
          .where('razorpayOrderId', '==', razorpayOrderId)
          .limit(1)
          .get();

        if (orderQuery.empty) {
          throw new Error(`Order not found for razorpayOrderId: ${razorpayOrderId}`);
        }
        
        const orderDoc = orderQuery.docs[0];
        if (orderDoc.data().status === 'paid') {
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

        transaction.update(orderDoc.ref, {
          status: 'paid',
          paidAt: new Date(),
          razorpayPaymentId: payment.id,
        });

        transaction.update(shopRef, {
          status: 'active',
          plan: plan,
          paid_till: newExpiryDate,
          updated_at: new Date(),
        });
      });
      
      if (shopOwnerPhone) {
        const formattedExpiry = format(newExpiryDate, 'dd MMMM yyyy');
        const confirmationMessage = `Namaste ${shopName || ''} 🎉\n\n₹${payment.amount / 100} payment received successfully.\nDukaanMitra active till ${formattedExpiry}.`;
        await sendWhatsAppMessage(shopOwnerPhone, confirmationMessage);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
    
  } catch (error: any) {
    console.error('[/api/verify-payment] Error:', error);
    return NextResponse.json({ message: error.message || 'Webhook failed' }, { status: 500 });
  }
}
