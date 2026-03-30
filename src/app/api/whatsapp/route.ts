
import { NextRequest, NextResponse } from 'next/server';
import { handleWhatsAppMessage } from '@/lib/services/whatsapp';
import crypto from 'crypto';

/**
 * Endpoint for WhatsApp Webhook Verification (GET) and Message Handling (POST).
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-whatsapp
 */

// Your chosen verification token, stored in environment variables
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

/**
 * Handles GET requests to verify the webhook with Meta.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Respond with the challenge token from the request
    console.log('WhatsApp webhook verified successfully.');
    return new NextResponse(challenge, { status: 200 });
  } else {
    // Respond with '403 Forbidden' if verify tokens do not match
    console.warn('WhatsApp webhook verification failed. Check your verify token.');
    return new NextResponse('Forbidden', { status: 403 });
  }
}

/**
 * Handles POST requests with incoming messages from WhatsApp.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-hub-signature-256');
  const rawBody = await request.text();
  
  if (!process.env.WHATSAPP_WEBHOOK_SECRET) {
      console.error('CRITICAL: WHATSAPP_WEBHOOK_SECRET is not set. Cannot verify request.');
      return new NextResponse('Internal Server Error', { status: 500 });
  }
  
  // 1. Verify the request signature to ensure it's from Meta
  const expectedSignature = `sha256=${crypto.createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET).update(rawBody).digest('hex')}`;

  if (signature !== expectedSignature) {
    console.warn('Invalid WhatsApp webhook signature received.');
    return new NextResponse('Forbidden', { status: 403 });
  }

  console.log('WhatsApp webhook signature verified.');

  try {
    const body = JSON.parse(rawBody);
    await handleWhatsAppMessage(body);

    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Error processing WhatsApp webhook request. Returning 500 so Meta can retry.', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
