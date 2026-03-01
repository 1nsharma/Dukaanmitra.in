
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
 * Deterministic parser for simple bill entries.
 * Returns null if the query is complex or needs AI reasoning.
 */
function parseSimpleBill(text: string): { amount: number; items: string; type: 'credit' | 'payment' } | null {
    const paymentKeywords = /\b(paid|jama|diya|received|naga)\b/i;
    const isPayment = paymentKeywords.test(text);
    const cleanText = text.replace(paymentKeywords, '').trim();
    const match = cleanText.match(/^(\d+\.?\d*)\s*(.*)$/) || cleanText.match(/^(.*)\s+(\d+\.?\d*)$/);
    
    if (match) {
        const amount = parseFloat(match[1].match(/\d/) ? match[1] : match[2]);
        const items = (match[1].match(/\d/) ? match[2] : match[1]).trim() || (isPayment ? 'Payment Received' : 'Bill Entry');
        return { amount, items, type: isPayment ? 'payment' : 'credit' };
    }
    return null;
}

/**
 * The Data Flywheel Message Processor.
 * Logs rich metadata for future Vertical LLM training.
 */
export async function processMessage(message: NormalizedMessage) {
    const startTime = Date.now();
    const queueDelay = startTime - message.receivedAt;
    const interactionRef = adminDb.collection('interactions').doc(message.messageId);

    try {
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            const reply = "Kripya shop code (#SHP123) ke saath bill bhejein. 🙏";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ processing_status: 'failed', system_response: "Missing shop code." });
            return;
        }
        
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const contextResult = await loadShopAndContextByShopCode(shopCode);
        if (!contextResult.success || !contextResult.shop || !contextResult.shopContext) {
            await sendWhatsAppMessage(message.from, contextResult.message || "Invalid shop code.");
            await interactionRef.update({ processing_status: 'failed', system_response: contextResult.message });
            return;
        }
        
        const { shop, shopContext } = contextResult;

        // --- SUBSCRIPTION BOUNDARY ---
        if (shop.status === 'locked' || shop.status === 'suspended') {
            const reply = "Aapka DukaanMitra plan expire ho gaya hai. Service continue karne ke liye dashboard se payment karein. 💳";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ 
                processing_status: 'processed', 
                system_response: reply, 
                detected_intent: 'subscription_lock' 
            });
            return;
        }

        // --- PATH 1: DETERMINISTIC (Data Flywheel: Confidence = 1.0) ---
        const simpleBill = parseSimpleBill(cleanedQuery);

        if (simpleBill) {
            const { amount, items, type } = simpleBill;
            const customerPhone = message.from;
            let replyMessage = "Bill add ho gaya! ✅";

            await adminDb.runTransaction(async (transaction) => {
                const customerRef = adminDb.collection('shops').doc(shopCode).collection('customers').doc(customerPhone);
                const ledgerRef = adminDb.collection('shops').doc(shopCode).collection('ledger').doc();
                const udhaarAmount = type === 'credit' ? amount : -amount;

                const customerDoc = await transaction.get(customerRef);
                if (!customerDoc.exists) {
                    transaction.set(customerRef, {
                        shop_id: shopCode, phone: customerPhone, name: `Customer ${customerPhone.slice(-4)}`,
                        visit_count: 1, total_spent: amount, totalUdhaar: udhaarAmount,
                        last_visit: FieldValue.serverTimestamp(), status: 'NEW', created_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp(), reminderCount: 0,
                    });
                } else {
                    transaction.update(customerRef, {
                        visit_count: FieldValue.increment(1), total_spent: FieldValue.increment(amount), totalUdhaar: FieldValue.increment(udhaarAmount),
                        last_visit: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp()
                    });
                }

                transaction.set(ledgerRef, {
                    id: ledgerRef.id, shop_id: shopCode, customerPhone, amount, item: items, type,
                    source: 'whatsapp', createdAt: FieldValue.serverTimestamp(), raw_text: message.text,
                });
            });

            await sendWhatsAppMessage(customerPhone, replyMessage);
            await interactionRef.update({ 
                processing_status: 'processed', 
                system_response: replyMessage, 
                detected_intent: 'ledger_entry',
                processing_path: 'deterministic',
                decision_confidence: 1.0,
                response_time_ms: Date.now() - startTime,
                queue_delay_ms: queueDelay
            });
        
        } else {
            // --- PATH 2: AI AGENT (Data Flywheel: Capture Reasoning Data) ---
            const agentInput: AgentInput = { query: cleanedQuery, shopContext };
            const agentOutput = await anigravityAgent(agentInput);

            if (agentOutput.action) {
                // Actions are routed through the ActionEngine for Boundary Safety
                const actionResult = await executeAction(agentOutput.action);
                if (!actionResult.success) {
                    agentOutput.response = actionResult.message || "Maaf kijiye, hum yeh entry nahi kar sakte.";
                }
            }

            if (agentOutput.response) {
                await sendWhatsAppMessage(message.from, agentOutput.response);
            }
            
            await interactionRef.update({
                processing_status: agentOutput.escalate ? 'escalated' : 'processed',
                system_response: agentOutput.response,
                detected_intent: agentOutput.intent,
                processing_path: 'ai_fallback',
                decision_confidence: agentOutput.confidence,
                response_time_ms: Date.now() - startTime,
                queue_delay_ms: queueDelay,
                shop_context_snapshot: shopContext // Snapshot for future training
            });
        }
    } catch (error) {
        console.error(`[Processor] CRITICAL FAILURE:`, error);
        await interactionRef.update({ 
            processing_status: 'failed', 
            system_response: (error as Error).message,
            error_details: JSON.stringify(error) 
        });
    }
}
