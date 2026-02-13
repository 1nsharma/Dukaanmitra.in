import { AgentInput, anigravityAgent } from '@/ai/flows/whatsapp-agent-flow';
import { loadShopAndContextByShopCode } from './context-loader';
import { sendWhatsAppMessage } from './whatsapp';
import { executeAction } from './action-engine';
import { getDoc, doc, runTransaction, increment, serverTimestamp, collection, addDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

let firestore = getFirestore(initializeFirebase().firebaseApp);

interface NormalizedMessage {
    from: string;
    to: string;
    text: string;
    messageId: string;
}

/**
 * Deterministic parser for simple bill entries.
 * Extracts the first number as amount, identifies payment keywords, and the rest as items.
 * Returns null if no amount is found, indicating it's not a simple bill.
 */
function parseSimpleBill(text: string): { amount: number; items: string; type: 'credit' | 'payment' } | null {
    const paymentKeywords = /\b(paid|jama|diya)\b/i;
    const isPayment = paymentKeywords.test(text);
    
    const cleanText = text.replace(paymentKeywords, '').trim();

    const match = cleanText.match(/(\d+\.?\d*)\s*(.*)/);
    if (match) {
        const amount = parseFloat(match[1]);
        const items = match[2].trim() || (isPayment ? 'Payment Received' : 'Bill Entry');
        return { amount, items, type: isPayment ? 'payment' : 'credit' };
    }
    return null;
}

/**
 * The main processor for incoming WhatsApp messages, implementing a
 * "Deterministic-First with AI Fallback" strategy.
 * @param message - The normalized message from the WhatsApp webhook.
 */
export async function processMessage(message: NormalizedMessage) {
    console.log(`[Processor] Started processing message ${message.messageId} from ${message.from}`);
    const interactionRef = doc(firestore, 'interactions', message.messageId);

    try {
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            await sendWhatsAppMessage(message.from, "Kripya shop code (#SHP123) ke saath bill bhejein.");
            await updateDoc(interactionRef, { processing_status: 'failed', system_response: "No shop code found." });
            return;
        }
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const contextResult = await loadShopAndContextByShopCode(shopCode);
        if (!contextResult.success || !contextResult.shop || !contextResult.shopContext) {
            await sendWhatsAppMessage(message.from, contextResult.message || "Invalid shop code.");
            await updateDoc(interactionRef, { processing_status: 'failed', system_response: contextResult.message });
            return;
        }
        
        const { shop, shopContext } = contextResult;

        if (shop.status === 'locked' || shop.status === 'suspended') {
            const reply = cleanedQuery.trim().toUpperCase() === 'PAY' 
                ? "Aapka plan expire ho gaya hai. Account reactivate karne ke liye, kripya apne DukaanMitra dashboard me login karke payment complete karein."
                : "Aapka DukaanMitra plan expire ho gaya hai. Service continue karne ke liye 'PAY' likh kar bhejein.";
            await sendWhatsAppMessage(message.from, reply);
            await updateDoc(interactionRef, { processing_status: 'processed', system_response: reply, detected_intent: 'shop_locked_interaction' });
            return;
        }

        // 1. ATTEMPT DETERMINISTIC PARSING (Fast & Free)
        const simpleBill = parseSimpleBill(cleanedQuery);

        if (simpleBill) {
            // --- Deterministic Path ---
            console.log(`[Processor] Message ${message.messageId} is a simple bill. Using deterministic parser.`);
            const { amount, items, type } = simpleBill;
            const customerPhone = message.from;
            let replyMessage = '';

            await runTransaction(firestore, async (transaction) => {
                const customerRef = doc(firestore, 'shops', shopCode, 'customers', customerPhone);
                const ledgerRef = doc(collection(firestore, 'shops', shopCode, 'ledger'));
                const customerDoc = await transaction.get(customerRef);

                const udhaarAmount = type === 'credit' ? amount : -amount;

                if (!customerDoc.exists()) {
                    replyMessage = "Shukriya! Aapka bill add ho gaya.";
                    transaction.set(customerRef, {
                        shop_id: shopCode, phone: customerPhone, name: `Customer ${customerPhone.slice(-4)}`,
                        visit_count: 1, total_spent: amount, totalUdhaar: udhaarAmount,
                        last_visit: serverTimestamp(), lastPaymentDate: type === 'payment' ? serverTimestamp() : null,
                        status: 'NEW', created_at: serverTimestamp(), updated_at: serverTimestamp(), reminderCount: 0,
                    });
                } else {
                    const visitCount = customerDoc.data().visit_count || 0;
                    replyMessage = visitCount >= 5 ? "Aap hamare loyal customer hain 🙏 Dhanyavaad!" : "Dhanyavaad! Aap phir aaye 😊";
                    const updateData: any = {
                        visit_count: increment(1), total_spent: increment(amount), totalUdhaar: increment(udhaarAmount),
                        last_visit: serverTimestamp(), status: visitCount + 1 >= 5 ? 'LOYAL' : 'REPEAT', updated_at: serverTimestamp()
                    };
                    if (type === 'payment') {
                        updateData.lastPaymentDate = serverTimestamp();
                        updateData.reminderCount = 0;
                    }
                    transaction.update(customerRef, updateData);
                }

                transaction.set(ledgerRef, {
                    id: ledgerRef.id, shop_id: shopCode, customerPhone, amount, item: items, type,
                    source: 'whatsapp', createdAt: serverTimestamp(), raw_text: message.text,
                    source_model_version: 'deterministic_parser_v1', source_confidence: 1.0,
                });
            });

            await sendWhatsAppMessage(customerPhone, replyMessage);
            await updateDoc(interactionRef, { processing_status: 'processed', system_response: replyMessage, detected_intent: 'ledger_entry_simple' });
        
        } else {
            // --- AI FALLBACK PATH ---
            console.log(`[Processor] Message ${message.messageId} is not a simple bill. Routing to AI Agent.`);
            
            const agentInput: AgentInput = { query: cleanedQuery, shopContext };
            const agentOutput = await anigravityAgent(agentInput);

            if (agentOutput.action) {
                await executeAction(agentOutput.action);
            }

            if (agentOutput.response) {
                await sendWhatsAppMessage(message.from, agentOutput.response);
            }
            
            await updateDoc(interactionRef, {
                processing_status: agentOutput.escalate ? 'escalated' : 'processed',
                system_response: agentOutput.response,
                detected_intent: agentOutput.intent,
                extracted_entities: agentOutput.action?.payload || null,
            });
        }
        console.log(`[Processor] Finished processing message ${message.messageId}`);
    } catch (error) {
        console.error(`[Processor] Unhandled error for message ${message.messageId}:`, error);
        await sendWhatsAppMessage(message.from, "Sorry, an unexpected error occurred. Please try again later.");
        await updateDoc(interactionRef, { processing_status: 'failed', system_response: (error as Error).message });
    }
}
