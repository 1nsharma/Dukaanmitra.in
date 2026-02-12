
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import { z } from 'zod';
import { auth } from 'firebase-admin';
import { addMonths } from 'date-fns';

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
    // Initialize services
    await initializeAdminApp();
    const firestore = getFirestore();
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID!,
      key_secret: RAZORPAY_KEY_SECRET!,
    });

    // 1. Verify User Authentication
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 2. Validate Request Body
    const body = await request.json();
    const validation = requestBodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request body', errors: validation.error.errors }, { status: 400 });
    }
    const { shopId, plan } = validation.data;
    
    const amount = planDetails[plan].amount;
    const amountInPaise = amount * 100;
    const currency = 'INR';

    // 3. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: `receipt_dukaanmitra_${shortid.generate()}`,
      notes: {
          shopId,
          userId,
          plan,
      }
    });

    // 4. Create Order document in Firestore
    const orderRef = firestore.collection('orders').doc();
    await orderRef.set({
      id: orderRef.id,
      shopId,
      userId,
      plan,
      amount,
      currency,
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      createdAt: new Date(),
    });

    // 5. Return Razorpay order details to the client
    return NextResponse.json(razorpayOrder, { status: 200 });

  } catch (error: any) {
    console.error('[/api/create-order] Error:', error);
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ message: 'Authentication token expired. Please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ message: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
