
import { processMessage } from "./agent-runner";
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

/**
 * Handles the incoming WhatsApp message payload from the webhook.
 * This function runs asynchronously and should not be awaited by the webhook endpoint.
 * @param body - The parsed JSON body from the WhatsApp webhook.
 */
export function handleWhatsAppMessage(body: any) {
    new Promise<void>(async (resolve) => {
        try {
            console.log('[WhatsAppService] Received webhook payload:', JSON.stringify(body, null, 2));

            if (body.object === 'whatsapp_business_account' && body.entry) {
                for (const entry of body.entry) {
                    if (entry.changes) {
                        for (const change of entry.changes) {
                            if (change.field === 'messages' && change.value.messages) {
                                for (const message of change.value.messages) {
                                    
                                    const messageId = message.id;
                                    const interactionRef = adminDb.collection('interactions').doc(messageId);
                                    const interactionDoc = await interactionRef.get();

                                    if (interactionDoc.exists()) {
                                        console.log(`[WhatsAppService] Duplicate interaction ID ${messageId} received. Ignoring.`);
                                        continue;
                                    }
                                    
                                    if (message.type === 'text') {
                                        const normalizedMessage = {
                                            from: message.from,
                                            to: change.value.metadata.display_phone_number,
                                            text: message.text.body,
                                            messageId: message.id,
                                        };

                                        const shopCodeMatch = normalizedMessage.text.match(/#(\w+)/);
                                        const shopId = shopCodeMatch ? shopCodeMatch[1].toUpperCase() : undefined;
                                        
                                        // Create a structured interaction log. This is the first write.
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
                                        
                                        // Route to the unified message processor
                                        await processMessage(normalizedMessage);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[WhatsAppService] Error in handleWhatsAppMessage:', error);
        }
        resolve();
    }).catch(e => console.error('[WhatsAppService] Unhandled promise rejection in handleWhatsAppMessage:', e));
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
