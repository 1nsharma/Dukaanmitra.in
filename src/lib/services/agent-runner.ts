
'use client';

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
 * Deterministic parser for high-confidence billing.
 * Confidence = 1.0 (Zero training needed).
 */
function parseSimpleBill(text: string) {
    const paymentKeywords = /\b(paid|jama|diya|received|naga)\b/i;
    const isPayment = paymentKeywords.test(text);
    const cleanText = text.replace(paymentKeywords, '').trim();
    const match = cleanText.match(/^(\d+\.?\d*)\s*(.*)$/) || cleanText.match(/^(.*)\s+(\d+\.?\d*)$/);
    
    if (match) {
        const amount = parseFloat(match[1].match(/\d/) ? match[1] : match[2]);
        const items = (match[1].match(/\d/) ? match[2] : match[1]).trim() || (isPayment ? 'Payment' : 'Bill');
        return { amount, items, type: isPayment ? 'payment' : 'credit' };
    }
    return null;
}

/**
 * Stage-5 Data Flywheel Message Processor.
 * Captures decision outcomes for future Vertical LLM training.
 */
export async function processMessage(message: NormalizedMessage) {
    const startTime = Date.now();
    const interactionRef = adminDb.collection('interactions').doc(message.messageId);

    try {
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            await sendWhatsAppMessage(message.from, "Shop code (#SHP123) ke saath bill bhejein. 🙏");
            return;
        }
        
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const { shop, shopContext, success, message: err } = await loadShopAndContextByShopCode(shopCode);
        if (!success || !shop || !shopContext) {
            await sendWhatsAppMessage(message.from, err || "Invalid shop code.");
            return;
        }

        if (shop.status === 'locked' || shop.status === 'suspended') {
            await sendWhatsAppMessage(message.from, "Aapka account locked hai. Dashboard se payment karein. 💳");
            return;
        }

        const simpleBill = parseSimpleBill(cleanedQuery);

        // --- PATH 1: DETERMINISTIC ---
        if (simpleBill) {
            const { amount, items, type } = simpleBill;
            await adminDb.runTransaction(async (transaction) => {
                const customerRef = adminDb.collection('shops').doc(shopCode).collection('customers').doc(message.from);
                const ledgerRef = adminDb.collection('shops').doc(shopCode).collection('ledger').doc();
                const udhaarImpact = type === 'credit' ? amount : -amount;

                const customerDoc = await transaction.get(customerRef);
                if (!customerDoc.exists) {
                    transaction.set(customerRef, {
                        shop_id: shopCode, phone: message.from, name: `Customer ${message.from.slice(-4)}`,
                        totalUdhaar: udhaarImpact, total_spent: amount, visit_count: 1,
                        status: 'NEW', created_at: FieldValue.serverTimestamp(),
                    });
                } else {
                    transaction.update(customerRef, {
                        totalUdhaar: FieldValue.increment(udhaarImpact),
                        total_spent: FieldValue.increment(amount),
                        visit_count: FieldValue.increment(1),
                        last_visit: FieldValue.serverTimestamp(),
                    });
                }
                transaction.set(ledgerRef, {
                    id: ledgerRef.id, shop_id: shopCode, customerPhone: message.from,
                    amount, item: items, type, source: 'whatsapp', createdAt: FieldValue.serverTimestamp(),
                });
            });

            const reply = "Entry confirmed! ✅";
            await sendWhatsAppMessage(message.from, reply);
            
            // Log Flywheel Metadata
            await interactionRef.update({
                processing_status: 'processed',
                system_response: reply,
                processing_path: 'deterministic',
                decision_confidence: 1.0,
                response_time_ms: Date.now() - startTime
            });
        
        } else {
            // --- PATH 2: AI AGENT (Confidence Gate) ---
            const agentOutput = await anigravityAgent({ query: cleanedQuery, shopContext });

            // Boundary 3: Confidence Gate (0.75)
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
                const actionResult = await executeAction(agentOutput.action);
                if (!actionResult.success) {
                    agentOutput.response = actionResult.message;
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
                shop_context_snapshot: shopContext // Training gold
            });
        }
    } catch (error) {
        console.error(`[Flywheel] Critical error:`, error);
        await interactionRef.update({ processing_status: 'failed', error_details: JSON.stringify(error) });
    }
}
