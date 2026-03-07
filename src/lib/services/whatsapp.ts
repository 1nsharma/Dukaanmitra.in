import { processMessage } from './agent-runner';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { logError, logInfo, logWarn } from '@/lib/observability';

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

interface WebhookContext {
  correlationId?: string;
}

interface NormalizedMessage {
  from: string;
  to: string;
  text: string;
  messageId: string;
}

function isMessageEvent(change: any): change is { field: string; value: { messages: any[]; metadata: { display_phone_number: string } } } {
  return change?.field === 'messages' && Array.isArray(change?.value?.messages);
}

export function handleWhatsAppMessage(body: any, context: WebhookContext = {}) {
  new Promise<void>(async (resolve) => {
    const correlationId = context.correlationId;

    try {
      if (body.object !== 'whatsapp_business_account' || !body.entry) {
        logWarn('whatsapp.message.unsupported_payload', { correlationId });
        resolve();
        return;
      }

      for (const entry of body.entry) {
        if (!Array.isArray(entry?.changes)) {
          continue;
        }

        for (const change of entry.changes) {
          if (!isMessageEvent(change)) {
            continue;
          }

          for (const message of change.value.messages) {
            const messageId = message?.id;
            if (!messageId) {
              continue;
            }

            const interactionRef = adminDb.collection('interactions').doc(messageId);
            const interactionDoc = await interactionRef.get();

            if (interactionDoc.exists) {
              logInfo('whatsapp.message.duplicate_ignored', { correlationId, messageId });
              continue;
            }

            if (message.type !== 'text' || !message?.text?.body) {
              continue;
            }

            const normalizedMessage: NormalizedMessage = {
              from: message.from,
              to: change.value.metadata.display_phone_number,
              text: message.text.body,
              messageId,
            };

            const shopCodeMatch = normalizedMessage.text.match(/#(\w+)/);
            const shopId = shopCodeMatch ? shopCodeMatch[1].toUpperCase() : undefined;

            const interactionData = {
              interactionId: messageId,
              shop_id: shopId,
              sender_phone: normalizedMessage.from,
              sender_type: 'customer',
              raw_message: normalizedMessage.text,
              processing_status: 'received',
              created_at: FieldValue.serverTimestamp(),
            };

            await interactionRef.set(interactionData);
            await processMessage(normalizedMessage);

            logInfo('whatsapp.message.processed', { correlationId, messageId, shopId });
          }
        }
      }
    } catch (error) {
      logError('whatsapp.message.processing_failed', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    resolve();
  }).catch((error) => {
    logError('whatsapp.message.unhandled_rejection', {
      correlationId: context.correlationId,
      error: error instanceof Error ? error.message : String(error),
    });
  });
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000, operationName = 'operation'): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      logWarn('retry.attempt_failed', {
        operationName,
        attempt: i + 1,
        nextDelayMs: delayMs * (i + 1),
        error: error?.message,
      });
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw new Error(`[Retry] ${operationName} failed after ${retries} attempts. Last error: ${lastError?.message}`);
}

export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  logInfo('whatsapp.send.start', { to });

  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    logError('whatsapp.send.missing_credentials', { to });
    return;
  }

  const url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text },
  };

  const sendOperation = async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`API Error ${response.status}: ${JSON.stringify(responseData)}`);
    }

    return response.json();
  };

  try {
    const responseData = await withRetry(sendOperation, 3, 1000, `Send WhatsApp message to ${to}`);
    logInfo('whatsapp.send.success', { to, responseData });
  } catch (error) {
    logError('whatsapp.send.failed', {
      to,
      error: error instanceof Error ? error.message : String(error),
    });

    const logData = {
      event: 'whatsapp_send_failure',
      level: 'CRITICAL',
      details: {
        to,
        text,
        error: error instanceof Error ? error.message : String(error),
      },
      createdAt: FieldValue.serverTimestamp(),
    };

    adminDb
      .collection('logs')
      .add(logData)
      .catch((logErr) => {
        logError('whatsapp.send.log_write_failed', {
          to,
          error: logErr instanceof Error ? logErr.message : String(logErr),
        });
      });
  }
}
