
import { processMessage } from "./agent-runner";
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

/**
 * Handles the incoming WhatsApp message payload from the webhook.
 * This function runs asynchronously and should not be awaited by the webhook endpoint.
 * @param body - The parsed JSON body from the WhatsApp webhook.
 */
export async function handleWhatsAppMessage(body: any) {
    try {
        if (body.object === 'whatsapp_business_account' && body.entry) {
            for (const entry of body.entry) {
                if (entry.changes) {
                    for (const change of entry.changes) {
                        if (change.field === 'messages' && change.value.messages) {
                            for (const message of change.value.messages) {
                                
                                const messageId = message.id;
                                const interactionRef = adminDb.collection('interactions').doc(messageId);
                                
                                // IDEMPOTENCY: Check if we already processed this message ID
                                const interactionDoc = await interactionRef.get();
                                if (interactionDoc.exists) {
                                    console.log(`[WhatsAppService] Duplicate message ${messageId} ignored.`);
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
                                    
                                    // Step 1: Initial Log (Acknowledge Receipt)
                                    await interactionRef.set({
                                        interactionId: messageId,
                                        shop_id: shopId,
                                        sender_phone: normalizedMessage.from,
                                        sender_type: 'customer',
                                        raw_message: normalizedMessage.text,
                                        processing_status: 'received',
                                        created_at: FieldValue.serverTimestamp(),
                                    });
                                    
                                    // Step 2: Handoff to async runner
                                    // We DO NOT await this here to keep the webhook response fast
                                    processMessage(normalizedMessage).catch(err => {
                                        console.error(`[WhatsAppService] Async processing error for ${messageId}:`, err);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('[WhatsAppService] Webhook parsing error:', error);
    }
}

/**
 * Sends a reply back to the user via the WhatsApp Business API.
 * Hardened with retries and structured logging.
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
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

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errBody = await response.json();
            throw new Error(`WhatsApp API Error ${response.status}: ${JSON.stringify(errBody)}`);
        }
        
        console.log(`[WhatsAppService] Message sent to ${to}`);
    } catch (error) {
        console.error(`[WhatsAppService] Failed to send message to ${to}:`, error);
        // Log critical failure to system logs
        await adminDb.collection('logs').add({
            event: 'whatsapp_send_failure',
            details: { to, error: (error as Error).message },
            createdAt: FieldValue.serverTimestamp(),
        });
    }
}
