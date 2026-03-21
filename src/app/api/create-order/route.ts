import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import { z } from 'zod';
import { auth } from 'firebase-admin';

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
    // Use the pre-initialized adminDb instance
    const firestore = adminDb;
    
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials missing');
      return NextResponse.json({ message: 'Payment provider not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
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

    // 3. Verify Ownership (Vulnerability Fix)
    const shopDoc = await firestore.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }
    const shopData = shopDoc.data();
    if (shopData?.owner_id !== userId) {
      console.warn(`Unauthorized payment attempt by user ${userId} for shop ${shopId}`);
      return NextResponse.json({ message: 'Forbidden: You do not own this shop' }, { status: 403 });
    }
    
    const amount = planDetails[plan].amount;
    const amountInPaise = amount * 100;
    const currency = 'INR';

    // 4. Create Razorpay Order
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

    // 5. Create Order document in Firestore
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

    // 6. Return Razorpay order details to the client
    return NextResponse.json(razorpayOrder, { status: 200 });

  } catch (error: any) {
    console.error('[/api/create-order] Error:', error);
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ message: 'Authentication token expired. Please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ message: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
