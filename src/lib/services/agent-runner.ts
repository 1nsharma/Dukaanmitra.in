
import { runWhatsappAgent } from '@/ai/flows/whatsapp-agent-flow';
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
 * Deterministic parser for simple "Amount Item" messages.
 * Rule: First number found is amount, remaining is description.
 */
function parseDeterministic(text: string) {
    const amountMatch = text.match(/(\d+)/);
    if (!amountMatch) return null;
    
    const amount = parseInt(amountMatch[1]);
    const items = text.replace(amountMatch[1], '').trim() || 'Samaan';
    const isPayment = /\b(paid|jama|diya)\b/i.test(text);
    
    return { amount, items, type: isPayment ? 'payment' : 'credit' };
}

/**
 * Orchestrates the processing logic for a message.
 * Implements: Deterministic-First -> AI-Fallback
 */
export async function processMessage(message: NormalizedMessage) {
    const interactionRef = adminDb.collection('interactions').doc(message.messageId);

    try {
        // 1. Identify Shop
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            await sendWhatsAppMessage(message.from, "Kripya shop code (#SHOP123) ke saath message bhejein.");
            await interactionRef.update({ processing_status: 'failed', system_response: "No shop code." });
            return;
        }
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const contextResult = await loadShopAndContextByShopCode(shopCode);
        if (!contextResult.success || !contextResult.shop) {
            await sendWhatsAppMessage(message.from, "Maaf kijiye, yeh shop code sahi nahi hai.");
            await interactionRef.update({ processing_status: 'failed', system_response: "Invalid shop code." });
            return;
        }
        
        const { shop, shopContext } = contextResult;

        // 2. SUBSCRIPTION ENFORCEMENT (Revenue Protection)
        if (shop.status === 'locked' || shop.status === 'suspended') {
            const reply = "Aapka plan expire ho gaya hai. Account reactivate karne ke liye DukaanMitra dashboard me payment karein.";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ processing_status: 'processed', system_response: reply });
            return;
        }

        // 3. DETERMINISTIC ENGINE (Safety First)
        const deterministicData = parseDeterministic(cleanedQuery);
        if (deterministicData && !/\?/.test(cleanedQuery)) {
            // If it looks like a standard entry and not a question, use deterministic logic
            const action = {
                type: 'ADD_LEDGER_ENTRY',
                payload: {
                    shopId: shop.id,
                    customer: { phone: message.from, name: `Customer ${message.from.slice(-4)}` },
                    transaction: { ...deterministicData, confidence_score: 1.0 }
                }
            };
            
            const result = await executeAction(action as any);
            const reply = result.success ? "Hisaab add ho gaya! ✅" : "Hisaab add karne me dikkat hui. Kripya manual try karein.";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ 
                processing_status: 'processed', 
                system_response: reply, 
                processing_path: 'deterministic' 
            });
            return;
        }

        // 4. AI FALLBACK (Intelligence Layer)
        const agentOutput = await runWhatsappAgent({ query: cleanedQuery, shopContext });

        if (agentOutput.action) {
            await executeAction(agentOutput.action);
        }

        if (agentOutput.response) {
            await sendWhatsAppMessage(message.from, agentOutput.response);
        }
        
        await interactionRef.update({
            processing_status: agentOutput.escalate ? 'escalated' : 'processed',
            system_response: agentOutput.response,
            detected_intent: agentOutput.intent,
            processing_path: 'ai_fallback',
        });

    } catch (error) {
        console.error(`[Processor] Error for ${message.messageId}:`, error);
        await interactionRef.update({ processing_status: 'failed', system_response: (error as Error).message });
    }
}
