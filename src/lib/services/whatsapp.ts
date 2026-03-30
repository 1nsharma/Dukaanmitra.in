
import { processMessage } from "./agent-runner";
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

/**
 * Handles the incoming WhatsApp message payload from the webhook.
 * @param body - The parsed JSON body from the WhatsApp webhook.
 */
export async function handleWhatsAppMessage(body: any): Promise<void> {
    console.log('[WhatsAppService] Received webhook payload:', JSON.stringify(body, null, 2));

    if (body.object !== 'whatsapp_business_account' || !body.entry) {
        console.warn('[WhatsAppService] Unsupported webhook payload. Skipping processing.');
        return;
    }

    const processingErrors: Array<{ interactionId: string; error: Error }> = [];

    for (const entry of body.entry) {
        if (!entry.changes) continue;

        for (const change of entry.changes) {
            if (change.field !== 'messages' || !change.value.messages) continue;

            for (const message of change.value.messages) {
                if (message.type !== 'text') continue;

                const messageId = message.id;
                const interactionRef = adminDb.collection('interactions').doc(messageId);

                const normalizedMessage = {
                    from: message.from,
                    to: change.value.metadata.display_phone_number,
                    text: message.text.body,
                    messageId: message.id,
                };

                const shopCodeMatch = normalizedMessage.text.match(/#(\w+)/);
                const shopId = shopCodeMatch ? shopCodeMatch[1].toUpperCase() : undefined;

                type ReservationResult = { shouldProcess: boolean; attempt: number; reason?: string };
                const reservation = await adminDb.runTransaction<ReservationResult>(async (tx) => {
                    const existingDoc = await tx.get(interactionRef);

                    if (!existingDoc.exists) {
                        tx.set(interactionRef, {
                            interactionId: messageId,
                            shop_id: shopId,
                            sender_phone: normalizedMessage.from,
                            sender_type: 'customer',
                            raw_message: normalizedMessage.text,
                            processing_status: 'processing',
                            processing_attempts: 1,
                            created_at: FieldValue.serverTimestamp(),
                            updated_at: FieldValue.serverTimestamp(),
                        });
                        return { shouldProcess: true, attempt: 1 };
                    }

                    const existingData = existingDoc.data() || {};
                    const existingStatus = existingData.processing_status;

                    if (existingStatus === 'completed' || existingStatus === 'processing') {
                        return { shouldProcess: false, attempt: existingData.processing_attempts ?? 1, reason: existingStatus };
                    }

                    const nextAttempt = (existingData.processing_attempts ?? 0) + 1;
                    tx.set(interactionRef, {
                        processing_status: 'processing',
                        processing_attempts: nextAttempt,
                        updated_at: FieldValue.serverTimestamp(),
                        last_error: null,
                    }, { merge: true });
                    return { shouldProcess: true, attempt: nextAttempt };
                });

                if (!reservation.shouldProcess) {
                    console.log(
                        `[WhatsAppService] Interaction ${messageId} already marked as ${reservation.reason}. Skipping duplicate retry.`
                    );
                    continue;
                }

                try {
                    await processMessage(normalizedMessage);
                    await interactionRef.set({
                        processing_status: 'completed',
                        processed_at: FieldValue.serverTimestamp(),
                        updated_at: FieldValue.serverTimestamp(),
                        last_error: null,
                    }, { merge: true });
                    console.log(`[WhatsAppService] Interaction ${messageId} processed successfully (attempt ${reservation.attempt}).`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(
                        `[WhatsAppService] Processing failed for interaction ${messageId} on attempt ${reservation.attempt}.`,
                        error
                    );

                    await interactionRef.set({
                        processing_status: 'failed',
                        failed_at: FieldValue.serverTimestamp(),
                        updated_at: FieldValue.serverTimestamp(),
                        last_error: errorMessage,
                    }, { merge: true });

                    processingErrors.push({
                        interactionId: messageId,
                        error: error instanceof Error ? error : new Error(errorMessage),
                    });
                }
            }
        }
    }

    if (processingErrors.length > 0) {
        const failedIds = processingErrors.map((e) => e.interactionId).join(', ');
        throw new Error(`[WhatsAppService] Failed interactions: ${failedIds}`);
    }
}


/**
 * A utility function to retry an async operation with exponential backoff.
 * @param fn The async function to retry.
 * @param retries Number of retries.
 * @param delayMs Initial delay in milliseconds.
 * @param operationName A name for the operation for logging.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000, operationName = 'operation'): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      console.warn(`[Retry] ${operationName} attempt ${i + 1} failed. Retrying in ${delayMs * (i + 1)}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1))); // Basic exponential backoff
    }
  }
  throw new Error(`[Retry] ${operationName} failed after ${retries} attempts. Last error: ${lastError?.message}`);
}


/**
 * Sends a reply back to the user via the WhatsApp Business API.
 * This has been hardened with a retry mechanism.
 * @param to - The recipient's phone number.
 * @param text - The message text to send.
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
    console.log(`[WhatsAppService] Sending message to ${to}: "${text}"`);
    
    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        console.error('[WhatsAppService] Missing WhatsApp API credentials in environment variables.');
        return;
    }
    
    const url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text },
    };

    const sendOperation = async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseData = await response.json();
            // Throw an error to trigger the retry mechanism
            throw new Error(`API Error ${response.status}: ${JSON.stringify(responseData)}`);
        }
        
        return response.json();
    };

    try {
        const responseData = await withRetry(sendOperation, 3, 1000, `Send WhatsApp message to ${to}`);
        console.log('[WhatsAppService] Message sent successfully:', responseData);
    } catch (error) {
        console.error(`[WhatsAppService] CRITICAL: Failed to send message to ${to} after multiple retries.`, error);
        
        const logData = {
            event: 'whatsapp_send_failure',
            level: 'CRITICAL',
            details: {
                to,
                text,
                error: (error as Error).message,
            },
            createdAt: FieldValue.serverTimestamp(),
        };
        adminDb.collection('logs').add(logData).catch(logErr => {
            console.error("ULTIMATE FAILURE: Could not even write to failure log.", logErr);
        });
    }
}
