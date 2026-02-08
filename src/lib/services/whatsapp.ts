
import { runAgentForMessage } from "./agent-runner";

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

/**
 * Handles the incoming WhatsApp message payload from the webhook.
 * This function runs asynchronously and should not be awaited by the webhook endpoint.
 * @param body - The parsed JSON body from the WhatsApp webhook.
 */
export function handleWhatsAppMessage(body: any) {
    // Using a Promise to handle the async work without blocking the main thread
    new Promise<void>(async (resolve) => {
        try {
            // 1. Log the incoming payload for debugging
            // In production, you'd use a proper logger and strip PII.
            console.log('[WhatsAppService] Received webhook payload:', JSON.stringify(body, null, 2));

            // 2. Check if it's a message event
            if (body.object === 'whatsapp_business_account' && body.entry) {
                for (const entry of body.entry) {
                    if (entry.changes) {
                        for (const change of entry.changes) {
                            if (change.field === 'messages' && change.value.messages) {
                                for (const message of change.value.messages) {
                                    // 3. Process only text messages for now
                                    if (message.type === 'text') {
                                        
                                        // 4. Normalize the message into a standard format
                                        const normalizedMessage = {
                                            from: message.from, // Customer's number
                                            to: change.value.metadata.display_phone_number, // Your business number
                                            text: message.text.body,
                                            messageId: message.id,
                                        };
                                        
                                        // 5. Trigger the AI agent runner
                                        await runAgentForMessage(normalizedMessage);
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
            // TODO: Add to a retry queue
        } else {
            console.log('[WhatsAppService] Message sent successfully:', responseData);
        }
    } catch (error) {
        console.error('[WhatsAppService] Exception while sending message:', error);
        // TODO: Add to a retry queue
    }
}
