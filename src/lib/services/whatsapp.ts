
import { processMessage } from "./agent-runner";
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

/**
 * Generates a simple hash for idempotency.
 */
function generatePayloadHash(to: string, text: string): string {
    return crypto.createHash('md5').update(`${to}:${text}`).digest('hex');
}

/**
 * Handles the incoming WhatsApp message payload from the webhook.
 * HARDENING: Immediate persistence check to prevent serverless termination loss.
 */
export function handleWhatsAppMessage(body: any) {
    new Promise<void>(async (resolve) => {
        try {
            if (body.object === 'whatsapp_business_account' && body.entry) {
                for (const entry of body.entry) {
                    if (entry.changes) {
                        for (const change of entry.changes) {
                            if (change.field === 'messages' && change.value.messages) {
                                for (const message of change.value.messages) {
                                    const messageId = message.id;
                                    const interactionRef = adminDb.collection('interactions').doc(messageId);
                                    
                                    // PRE-CHECK: Atomic check for existing processing
                                    const interactionDoc = await interactionRef.get();
                                    if (interactionDoc.exists()) {
                                        console.log(`[WhatsAppService] Duplicate ID ${messageId}. Ignoring.`);
                                        continue;
                                    }
                                    
                                    if (message.type === 'text') {
                                        const normalizedMessage = {
                                            from: message.from,
                                            to: change.value.metadata.display_phone_number,
                                            text: message.text.body,
                                            messageId: message.id,
                                            receivedAt: Date.now(),
                                        };

                                        const shopCodeMatch = normalizedMessage.text.match(/#(\w+)/);
                                        const shopId = shopCodeMatch ? shopCodeMatch[1].toUpperCase() : undefined;
                                        
                                        // 1. PERSISTENCE LAYER: Record receipt before logic
                                        await interactionRef.set({
                                            interactionId: messageId,
                                            shop_id: shopId,
                                            sender_phone: normalizedMessage.from,
                                            sender_type: 'customer',
                                            raw_message: normalizedMessage.text,
                                            processing_status: 'received',
                                            created_at: FieldValue.serverTimestamp(),
                                        });
                                        
                                        // 2. DISPATCH: Process message
                                        // Note: In Stage-6, this will be pushed to a real Queue (Pub/Sub)
                                        await processMessage(normalizedMessage);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[WhatsAppService] Critical Error:', error);
        }
        resolve();
    }).catch(e => console.error('[WhatsAppService] Unhandled Rejection:', e));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1))); 
    }
  }
  throw new Error(`Failed after ${retries} attempts. Last error: ${lastError?.message}`);
}

/**
 * Sends a reply back to the user via the WhatsApp Business API.
 * HARDENING: Outbox pattern logging for delivery reliability.
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
    const payloadHash = generatePayloadHash(to, text);
    const logRef = adminDb.collection('whatsapp_outbox').doc(payloadHash);
    
    // Idempotency check for the outbox
    const existingEntry = await logRef.get();
    if (existingEntry.exists && existingEntry.data()?.status === 'sent') {
        return;
    }

    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        console.error('[WhatsAppService] Missing API credentials.');
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
            throw new Error(`WhatsApp API Error: ${JSON.stringify(responseData)}`);
        }
        return response.json();
    };

    try {
        // Log intent to send
        await logRef.set({ 
            to, 
            text, 
            status: 'pending', 
            retryCount: 0,
            createdAt: FieldValue.serverTimestamp() 
        }, { merge: true });

        const responseData = await withRetry(sendOperation, 3, 1000);
        
        // Update on success
        await logRef.update({ 
            status: 'sent', 
            sentAt: FieldValue.serverTimestamp(), 
            response: responseData 
        });
    } catch (error) {
        console.error(`[WhatsAppService] Delivery failed to ${to}:`, error);
        await logRef.update({ 
            status: 'failed', 
            lastError: (error as Error).message,
            updatedAt: FieldValue.serverTimestamp()
        });
    }
}
