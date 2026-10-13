
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import { z } from 'zod';
import { auth } from 'firebase-admin';

export const dynamic = 'force-dynamic';

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

const planDetails: Record<string, { amount: number, name: string }> = {
    'basic': { amount: 1999, name: 'Basic Plan' },
    'pro': { amount: 4999, name: 'Pro Plan' },
};

const requestBodySchema = z.object({
  shopId: z.string(),
  plan: z.enum(['basic', 'pro']),
});

export async function POST(request: Request) {
  try {
    const firestore = adminDb;
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID!,
      key_secret: RAZORPAY_KEY_SECRET!,
    });

    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const body = await request.json();
    const validation = requestBodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
    const { shopId, plan } = validation.data;
    
    const shopDoc = await firestore.collection('shops').doc(shopId).get();
    if (!shopDoc.exists || shopDoc.data()?.owner_id !== userId) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const amount = planDetails[plan].amount;
    const amountInPaise = amount * 100;

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${shortid.generate()}`,
      notes: { shopId, userId, plan }
    });

    const orderRef = firestore.collection('orders').doc();
    await orderRef.set({
      id: orderRef.id,
      shopId,
      userId,
      plan,
      amount,
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      createdAt: new Date(),
    });

    return NextResponse.json(razorpayOrder, { status: 200 });

  } catch (error: any) {
    console.error('[/api/create-order] Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
