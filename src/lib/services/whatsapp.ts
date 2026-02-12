
import { runAgentForMessage, processBillMessage } from "./agent-runner";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
const firestore = getFirestore(initializeFirebase().firebaseApp);

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
                                    
                                    // 1. Duplicate Message Protection
                                    const messageId = message.id;
                                    const processedRef = doc(firestore, 'processedMessages', messageId);
                                    const processedDoc = await getDoc(processedRef);

                                    if (processedDoc.exists()) {
                                        console.log(`[WhatsAppService] Duplicate message ID ${messageId} received. Ignoring.`);
                                        continue; // Skip already processed message
                                    }
                                    
                                    if (message.type === 'text') {
                                        const normalizedMessage = {
                                            from: message.from,
                                            to: change.value.metadata.display_phone_number,
                                            text: message.text.body,
                                            messageId: message.id,
                                        };
                                        
                                        // Mark message as processed immediately
                                        await setDoc(processedRef, { processedAt: serverTimestamp() });
                                        
                                        // 2. Route to the deterministic bill processor
                                        await processBillMessage(normalizedMessage);
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
 * Sends a reply back to the user via the WhatsApp Business API.
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

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`[WhatsAppService] Error sending message: ${response.status} ${response.statusText}`, responseData);
        } else {
            console.log('[WhatsAppService] Message sent successfully:', responseData);
        }
    } catch (error) {
        console.error('[WhatsAppService] Exception while sending message:', error);
    }
}
