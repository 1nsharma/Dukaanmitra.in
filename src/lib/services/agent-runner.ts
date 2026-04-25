
import { AgentInput, anigravityAgent } from '@/ai/flows/whatsapp-agent-flow';
import { loadShopAndContextByShopCode } from './context-loader';
import { sendWhatsAppMessage } from './whatsapp';
import { executeAction } from './action-engine';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerService } from '@/lib/modules/ledger/services/ledger-service';
import { DeterministicAgent } from '@/ai/free/deterministic-agent';

interface NormalizedMessage {
    from: string;
    to: string;
    text: string;
    messageId: string;
}

/**
 * Bharat Language Engine: Deterministic parser for local dialects.
 * Extracting metadata only. DB operations delegated to LedgerService for integrity.
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
 * HARDENED: All write paths consolidated through LedgerService.
 */
export async function processMessage(message: NormalizedMessage) {
    const interactionRef = adminDb.collection('interactions').doc(message.messageId);
    const correlationId = message.messageId; // Message ID is our initial correlation root

    try {
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            const reply = "Namaste 🙏 Kripya shop code (#ABC) ke saath message bhejein.";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ processing_status: 'failed', system_response: reply });
            return;
        }
        
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const contextResult = await loadShopAndContextByShopCode(shopCode);
        if (!contextResult.success || !contextResult.shop || !contextResult.shopContext) {
            const reply = "Maaf kijiye, yeh shop code invalid hai. ❌";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ processing_status: 'failed', system_response: reply });
            return;
        }
        
        const { shop, shopContext } = contextResult;

        // Revenue Engine Gate
        if (shop.status === 'locked' || shop.status === 'suspended' || shop.status === 'integrity_lock') {
            const reply = shop.status === 'integrity_lock' 
                ? "Aapki shop integrity safety check ke liye lock hai. Kripya support se baat karein."
                : "Aapka DukaanMitra plan expire ho gaya hai. Service continue karne ke liye dashboard se payment karein. 🙏";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ processing_status: 'processed', system_response: reply });
            return;
        }

        // 1. ATTEMPT DETERMINISTIC PARSING (Fast, Free, High Integrity)
        const deterministicResult = await DeterministicAgent.process({ query: cleanedQuery, shopContext });

        if (deterministicResult) {
            console.log(`[Processor] Using deterministic path for ${message.messageId}`);
            
            if (deterministicResult.action && deterministicResult.action.type === 'ADD_LEDGER_ENTRY') {
                const tx = deterministicResult.action.payload.transaction;
                await LedgerService.addEntry({ 
                    id: 'system', 
                    role: 'system', 
                    shopId: shopCode 
                }, shopCode, {
                    customerPhone: message.from,
                    customerName: tx.customer_name || `Customer ${message.from.slice(-4)}`,
                    amount: tx.amount,
                    item: tx.items,
                    type: tx.type,
                    source: 'whatsapp'
                }, correlationId);
            }

            const reply = deterministicResult.response || "Ji Namaste 🙏 Kaam ho gaya hai. ✅";
            await sendWhatsAppMessage(message.from, reply);
            
            await interactionRef.update({ 
                processing_status: 'processed', 
                system_response: reply, 
                detected_intent: deterministicResult.intent,
                processing_path: 'deterministic_agent',
            });
        
        } else {
            // --- AI FALLBACK PATH ---
            console.log(`[Processor] Using AI fallback for ${message.messageId}`);
            const agentInput: AgentInput = { query: cleanedQuery, shopContext };
            const agentOutput = await anigravityAgent(agentInput);

            if (agentOutput.action) {
                await executeAction(agentOutput.action, { id: 'system', role: 'system', shopId: shopCode }, correlationId);
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
        console.error(`[Processor] Critical Error for ${message.messageId}:`, error);
        const errorReply = "Sorry, thoda network issue hai. Kripya 2 minute baad try karein. 🙏";
        await sendWhatsAppMessage(message.from, errorReply);
        await interactionRef.update({ processing_status: 'failed', system_response: (error as Error).message });
    }
}
