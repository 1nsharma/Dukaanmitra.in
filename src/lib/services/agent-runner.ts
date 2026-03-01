
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
    receivedAt: number;
}

/**
 * Deterministic parser for high-fidelity billing.
 * Confidence = 1.0 (The Flywheel Baseline).
 */
function parseSimpleBill(text: string) {
    const paymentKeywords = /\b(paid|jama|diya|received|payment)\b/i;
    const isPayment = paymentKeywords.test(text);
    const cleanText = text.replace(paymentKeywords, '').trim();
    const match = cleanText.match(/^(\d+\.?\d*)\s*(.*)$/) || cleanText.match(/^(.*)\s+(\d+\.?\d*)$/);
    
    if (match) {
        const amountStr = match[1].match(/\d/) ? match[1] : match[2];
        const items = (match[1].match(/\d/) ? match[2] : match[1]).trim() || (isPayment ? 'Payment' : 'Bill');
        return { amount: parseFloat(amountStr), items, type: isPayment ? 'payment' : 'credit' };
    }
    return null;
}

/**
 * Stage-5 Multi-Path Processor.
 * Captures decision context snapshots for future Vertical LLM training.
 */
export async function processMessage(message: NormalizedMessage) {
    const startTime = Date.now();
    const interactionRef = adminDb.collection('interactions').doc(message.messageId);

    try {
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            const reply = "Kripya shop code (#SHP123) ke saath bill bhejein. 🙏";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ processing_status: 'failed', system_response: reply });
            return;
        }
        
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const { shop, shopContext, success, message: err } = await loadShopAndContextByShopCode(shopCode);
        if (!success || !shop || !shopContext) {
            const reply = err || "Invalid shop code.";
            await sendWhatsAppMessage(message.from, reply);
            return;
        }

        if (shop.status === 'locked' || shop.status === 'suspended') {
            await sendWhatsAppMessage(message.from, "Aapka account locked hai. Dashboard se payment karein. 💳");
            return;
        }

        const simpleBill = parseSimpleBill(cleanedQuery);

        // --- PATH 1: DETERMINISTIC (Confidence 1.0) ---
        if (simpleBill) {
            const { amount, items, type } = simpleBill;
            const action = {
                type: 'ADD_LEDGER_ENTRY',
                payload: {
                    shopId: shopCode,
                    customerPhone: message.from,
                    transaction: { amount, items, type, customerName: `Customer ${message.from.slice(-4)}` }
                }
            };

            // Deterministic is Layer 0 - can write directly
            await executeAction(action, 'system'); 
            
            const reply = "Entry confirmed! ✅";
            await sendWhatsAppMessage(message.from, reply);
            
            await interactionRef.update({
                processing_status: 'processed',
                system_response: reply,
                processing_path: 'deterministic',
                decision_confidence: 1.0,
                response_time_ms: Date.now() - startTime,
                queue_delay_ms: Date.now() - message.receivedAt
            });
        
        } else {
            // --- PATH 2: AI FALLBACK (Confidence Gate) ---
            const agentOutput = await anigravityAgent({ query: cleanedQuery, shopContext });

            // BOUNDARY: Confidence Gate (0.75)
            if (agentOutput.confidence < 0.75 || agentOutput.escalate) {
                const reply = "Iske liye main shopkeeper se confirm karke bataunga. 🙂";
                await sendWhatsAppMessage(message.from, reply);
                await interactionRef.update({
                    processing_status: 'escalated',
                    system_response: reply,
                    decision_confidence: agentOutput.confidence,
                    processing_path: 'ai_fallback',
                    shop_context_snapshot: shopContext
                });
                return;
            }

            if (agentOutput.action) {
                // ActionEngine handles Policy Guard & Risk Classification
                const result = await executeAction(agentOutput.action, 'system');
                if (result.message && !agentOutput.response) {
                    agentOutput.response = result.message;
                }
            }

            if (agentOutput.response) {
                await sendWhatsAppMessage(message.from, agentOutput.response);
            }
            
            await interactionRef.update({
                processing_status: 'processed',
                system_response: agentOutput.response,
                detected_intent: agentOutput.intent,
                processing_path: 'ai_fallback',
                decision_confidence: agentOutput.confidence,
                response_time_ms: Date.now() - startTime,
                shop_context_snapshot: shopContext, // Training Gold
                extracted_entities: agentOutput.action?.payload || null
            });
        }
    } catch (error) {
        console.error(`[DataFlywheel] Critical error:`, error);
        await interactionRef.update({ processing_status: 'failed', system_response: (error as Error).message });
    }
}
