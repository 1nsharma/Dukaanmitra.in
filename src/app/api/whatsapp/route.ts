
import { NextRequest, NextResponse } from 'next/server';
import { handleWhatsAppMessage } from '@/lib/services/whatsapp';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-hub-signature-256');
  const rawBody = await request.text();
  
  if (!process.env.WHATSAPP_WEBHOOK_SECRET) {
      return new NextResponse('Internal Server Error', { status: 500 });
  }
  
  const expectedSignature = `sha256=${crypto.createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET).update(rawBody).digest('hex')}`;

  if (signature !== expectedSignature) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const body = JSON.parse(rawBody);
    handleWhatsAppMessage(body);
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
