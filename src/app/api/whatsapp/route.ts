import { NextRequest, NextResponse } from 'next/server';
import { handleWhatsAppMessage } from '@/lib/services/whatsapp';
import { createCorrelationId, logError, logInfo, logWarn } from '@/lib/observability';
import crypto from 'crypto';
import { z } from 'zod';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

const webhookPayloadSchema = z.object({
  object: z.string(),
  entry: z.array(z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    logInfo('whatsapp.webhook.verified');
    return new NextResponse(challenge, { status: 200 });
  }

  logWarn('whatsapp.webhook.verification_failed');
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  const correlationId = createCorrelationId();
  const signature = request.headers.get('x-hub-signature-256');
  const rawBody = await request.text();

  if (!process.env.WHATSAPP_WEBHOOK_SECRET) {
    logError('whatsapp.webhook.secret_missing', { correlationId });
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')}`;

  if (signature !== expectedSignature) {
    logWarn('whatsapp.webhook.invalid_signature', { correlationId });
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const parsedBody: unknown = JSON.parse(rawBody);
    const payloadResult = webhookPayloadSchema.safeParse(parsedBody);

    if (!payloadResult.success) {
      logWarn('whatsapp.webhook.invalid_payload', {
        correlationId,
        issues: payloadResult.error.issues,
      });
      return new NextResponse('Bad Request', { status: 400 });
    }

    void handleWhatsAppMessage(payloadResult.data, { correlationId });
    logInfo('whatsapp.webhook.accepted', { correlationId });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    logError('whatsapp.webhook.processing_error', {
      correlationId,
      error: error instanceof Error ? error.message : String(error),
    });
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
