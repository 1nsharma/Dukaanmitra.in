import { AgentInput, anigravityAgent } from '@/ai/flows/whatsapp-agent-flow';
import { loadShopAndContextByShopCode } from './context-loader';
import { sendWhatsAppMessage } from './whatsapp';
import { executeAction } from './action-engine';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface NormalizedMessage {
    from: string;
    to: string;
    text: string;
    messageId: string;
}

/**
 * Bharat Language Engine: Deterministic parser for local dialects.
 */
function parseSimpleBill(text: string): { amount: number; items: string; type: 'credit' | 'payment' } | null {
    const creditKeywords = /\b(udhaar|baaki|likh|likhlena|credit|de-baaki)\b/i;
    const paymentKeywords = /\b(paid|jama|diya|payment|dhila|upas)\b/i;
    
    const isCredit = creditKeywords.test(text);
    const isPayment = paymentKeywords.test(text);
    
    if (!isCredit && !isPayment) return null;

    const cleanText = text.replace(creditKeywords, '').replace(paymentKeywords, '').trim();

    const match = cleanText.match(/(\d+\.?\d*)\s*(.*)/);
    if (match) {
        const amount = parseFloat(match[1]);
        const items = match[2].trim() || (isPayment ? 'Payment Received' : 'Bill Entry');
        return { amount, items, type: isPayment ? 'payment' : 'credit' };
    }
    return null;
}

/**
 * The main processor for incoming WhatsApp messages.
 * MARKET PILOT: Hardened for human-readable error responses.
 */
export async function processMessage(message: NormalizedMessage) {
    console.log(`[Processor] Started processing message ${message.messageId}`);
    const interactionRef = adminDb.collection('interactions').doc(message.messageId);

    try {
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            await sendWhatsAppMessage(message.from, "Namaste 🙏 Kripya shop code (#ABC) ke saath message bhejein.");
            await interactionRef.update({ processing_status: 'failed', system_response: "No shop code found." });
            return;
        }
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const contextResult = await loadShopAndContextByShopCode(shopCode);
        if (!contextResult.success || !contextResult.shop || !contextResult.shopContext) {
            await sendWhatsAppMessage(message.from, "Maaf kijiye, yeh shop code invalid hai. ❌");
            await interactionRef.update({ processing_status: 'failed', system_response: contextResult.message });
            return;
        }
        
        const { shop, shopContext } = contextResult;

        if (shop.status === 'locked' || shop.status === 'suspended') {
            const reply = "Aapka DukaanMitra trial expire ho gaya hai. Service continue karne ke liye kripya login karke payment karein. 🙏";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ processing_status: 'processed', system_response: reply });
            return;
        }

        // 1. ATTEMPT DETERMINISTIC PARSING
        const simpleBill = parseSimpleBill(cleanedQuery);

        if (simpleBill) {
            const { amount, items, type } = simpleBill;
            const customerPhone = message.from;
            let replyMessage = '';

            await adminDb.runTransaction(async (transaction) => {
                const customerRef = adminDb.collection('shops').doc(shopCode).collection('customers').doc(customerPhone);
                const ledgerRef = adminDb.collection('shops').doc(shopCode).collection('ledger').doc();
                const customerDoc = await transaction.get(customerRef);

                const udhaarAmount = type === 'credit' ? amount : -amount;

                if (!customerDoc.exists) {
                    replyMessage = `Ji Namaste 🙏\n\nAapka ₹${amount} ka ${type} record kar liya gaya hai.\n\nShukriya!`;
                    transaction.set(customerRef, {
                        shop_id: shopCode, phone: customerPhone, name: `Customer ${customerPhone.slice(-4)}`,
                        visit_count: 1, total_spent: amount, totalUdhaar: udhaarAmount,
                        last_visit: FieldValue.serverTimestamp(), status: 'NEW', 
                        created_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp()
                    });
                } else {
                    replyMessage = `Ji Dhanyavaad! ✅\n\n₹${amount} record ho gaya hai.\n\nTotal Balance: ₹${(customerDoc.data()!.totalUdhaar || 0) + udhaarAmount}`;
                    transaction.update(customerRef, {
                        visit_count: FieldValue.increment(1), 
                        total_spent: FieldValue.increment(amount), 
                        totalUdhaar: FieldValue.increment(udhaarAmount),
                        last_visit: FieldValue.serverTimestamp(), 
                        updated_at: FieldValue.serverTimestamp()
                    });
                }

                transaction.set(ledgerRef, {
                    id: ledgerRef.id, shop_id: shopCode, customerPhone, amount, item: items, type,
                    source: 'whatsapp', createdAt: FieldValue.serverTimestamp(), raw_text: message.text,
                    source_model_version: 'deterministic_parser_v1', source_confidence: 1.0,
                });
            });

            await sendWhatsAppMessage(customerPhone, replyMessage);
            await interactionRef.update({ 
                processing_status: 'processed', 
                system_response: replyMessage, 
                detected_intent: 'ledger_entry_simple',
                processing_path: 'deterministic',
            });
        
        } else {
            // --- AI FALLBACK PATH ---
            const agentInput: AgentInput = { query: cleanedQuery, shopContext };
            const agentOutput = await anigravityAgent(agentInput);

            if (agentOutput.action) {
                await executeAction(agentOutput.action, { id: 'system', role: 'system', shopId: shopCode });
            }

            const finalReply = agentOutput.response || "Bhaiya, yeh entry samajh nahi aayi. ❌ Kripya dobara likhein.";
            await sendWhatsAppMessage(message.from, finalReply);
            
            await interactionRef.update({
                processing_status: agentOutput.escalate ? 'escalated' : 'processed',
                system_response: finalReply,
                detected_intent: agentOutput.intent,
                processing_path: 'ai_fallback',
            });
        }
    } catch (error) {
        console.error(`[Processor] Error:`, error);
        await sendWhatsAppMessage(message.from, "Sorry, thoda network issue hai. Kripya 2 minute baad try karein. 🙏");
        await interactionRef.update({ processing_status: 'failed', system_response: (error as Error).message });
    }
}
