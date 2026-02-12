

import { AgentInput, anigravityAgent } from '@/ai/flows/whatsapp-agent-flow';
import { loadShopAndContextByShopCode } from './context-loader';
import { sendWhatsAppMessage } from './whatsapp';
import { executeAction } from './action-engine';
import { getDoc, doc, runTransaction, increment, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Initialize Firestore outside of the function to be reused.
let firestore = getFirestore(initializeFirebase().firebaseApp);

interface NormalizedMessage {
    from: string; // Customer's phone number
    to: string; // Your business's WhatsApp number
    text: string; // The message content
    messageId: string; // The WhatsApp message ID
}

/**
 * Parses a bill from a text message.
 * Extracts the first number as the amount and the rest as items.
 * @param text The message text.
 * @returns Parsed bill information or null if no amount is found.
 */
function parseBill(text: string): { amount: number; items: string } | null {
    // Regex to find the first number (integer or decimal) and capture the rest of the string.
    const match = text.match(/(\d+\.?\d*)\s*(.*)/);
    if (match) {
        const amount = parseFloat(match[1]);
        const items = match[2].trim() || 'Bill Entry';
        return { amount, items };
    }
    return null;
}


/**
 * The main deterministic processor for incoming messages.
 * Replaces the AI agent for core bill processing in Raasta-1.
 * @param message - The normalized message from the WhatsApp webhook.
 */
export async function processBillMessage(message: NormalizedMessage) {
    console.log(`[Processor] Processing message from ${message.from}: "${message.text}"`);
    const logCollection = collection(firestore, 'logs');

    try {
        // 1. Extract Shop Code
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            console.warn(`[Processor] No shop code found.`);
            await sendWhatsAppMessage(message.from, "Kripya shop code ke saath bill bhejein. Example: HI #SHP123");
            await addDoc(logCollection, { event: 'missing_shop_code', phone: message.from, text: message.text, createdAt: serverTimestamp() });
            return;
        }
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        // 2. Load Shop
        const shopRef = doc(firestore, 'shops', shopCode);
        const shopDoc = await getDoc(shopRef);

        if (!shopDoc.exists()) {
            console.warn(`[Processor] Invalid shop code: ${shopCode}`);
            await sendWhatsAppMessage(message.from, "Invalid shop code. Please check and try again.");
            await addDoc(logCollection, { event: 'invalid_shop_code', shopCode, phone: message.from, createdAt: serverTimestamp() });
            return;
        }
        const shop = shopDoc.data();

        // 3. HARD STOP: Check if shop is locked
        if (shop.status === 'locked' || shop.status === 'suspended') {
            console.log(`[Processor] Shop ${shopCode} is locked. Blocking message.`);
            await sendWhatsAppMessage(message.from, "This shop's DukaanMitra plan has expired. Please contact the owner to continue service.");
            await addDoc(logCollection, { event: 'shop_locked', shopId: shopCode, phone: message.from, createdAt: serverTimestamp() });
            return;
        }

        // 4. Parse bill deterministically
        const parsedBill = parseBill(cleanedQuery);
        if (!parsedBill) {
            console.log(`[Processor] No amount found in message. Not a bill. Message: "${cleanedQuery}"`);
            // For Raasta-1, we can choose to either ignore or send to AI for general chat.
            // For now, we ignore to keep it simple.
            await addDoc(logCollection, { event: 'non_bill_message', shopId: shopCode, phone: message.from, text: cleanedQuery, createdAt: serverTimestamp() });
            return;
        }

        const { amount, items } = parsedBill;
        const customerPhone = message.from;
        
        let replyMessage = '';

        // 5. Run DB updates in a single transaction
        await runTransaction(firestore, async (transaction) => {
            const customerRef = doc(firestore, 'shops', shopCode, 'customers', customerPhone);
            const ledgerRef = doc(collection(firestore, 'shops', shopCode, 'ledger'));

            const customerDoc = await transaction.get(customerRef);
            let visitCount = 0;

            if (!customerDoc.exists()) {
                // New Customer
                replyMessage = "Shukriya! Aapka bill add ho gaya.";
                transaction.set(customerRef, {
                    shop_id: shopCode,
                    phone: customerPhone,
                    name: `Customer ${customerPhone.slice(-4)}`, // Default name
                    visit_count: 1,
                    total_spent: amount,
                    last_visit: serverTimestamp(),
                    status: 'NEW',
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp(),
                });
            } else {
                // Existing Customer
                const customerData = customerDoc.data();
                visitCount = customerData.visit_count || 0;
                
                if (visitCount >= 5) {
                    replyMessage = "Aap hamare loyal customer hain 🙏 Dhanyavaad!";
                } else {
                    replyMessage = "Dhanyavaad! Aap phir aaye 😊";
                }

                transaction.update(customerRef, {
                    visit_count: increment(1),
                    total_spent: increment(amount),
                    last_visit: serverTimestamp(),
                    status: visitCount + 1 >= 5 ? 'LOYAL' : 'REPEAT',
                    updated_at: serverTimestamp()
                });
            }

            // Create ledger entry (assuming all entries are credit for now)
            transaction.set(ledgerRef, {
                shop_id: shopCode,
                customerPhone: customerPhone,
                amount: amount,
                item: items,
                type: 'credit', // Defaulting to credit
                source: 'whatsapp',
                createdAt: serverTimestamp(),
            });
        });
        
        // 6. Send reply
        await sendWhatsAppMessage(customerPhone, replyMessage);
        await addDoc(logCollection, { event: 'bill_processed_successfully', shopId: shopCode, phone: customerPhone, amount, items, createdAt: serverTimestamp() });

    } catch (error) {
        console.error('[Processor] Unhandled error during message processing:', error);
        await sendWhatsAppMessage(message.from, "Sorry, an unexpected error occurred. Please try again later.");
        await addDoc(logCollection, { event: 'processing_error', error: (error as Error).message, text: message.text, createdAt: serverTimestamp() });
    }
}


// The AI Agent is kept for future use (Raasta-2) but is no longer on the main bill processing path.
export async function runAgentForMessage(message: NormalizedMessage) {
    // This function can be used for non-billing related conversations in the future.
    console.log(`[AgentRunner] AI Agent processing for non-billing query from ${message.from}`);
     try {
        const contextResult = await loadShopAndContextByShopCode('DUMMY'); // Needs a shop context
        if (!contextResult.success || !contextResult.shopContext) return;
        
        const agentInput: AgentInput = {
            query: message.text,
            shopContext: contextResult.shopContext,
        };
        const agentOutput = await anigravityAgent(agentInput);

        if (agentOutput.response) {
            await sendWhatsAppMessage(message.from, agentOutput.response);
        }
    } catch(e) {
        console.error("Agent runner failed", e);
    }
}
