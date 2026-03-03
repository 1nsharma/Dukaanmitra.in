
import { anigravityAgent } from '@/ai/flows/whatsapp-agent-flow';
import { loadShopAndContextByShopCode } from './context-loader';
import { sendWhatsAppMessage } from './whatsapp';
import { executeAction } from './action-engine';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * MitraOS Unified Processor (Layer 0-2 Autonomy)
 * Implements the "Data Flywheel" by logging snapshots for future Vertical LLM training.
 */
export async function processMessage(message: { from: string; text: string; messageId: string; receivedAt: number; correlationId: string }) {
    const startTime = Date.now();
    const interactionRef = adminDb.collection('interactions').doc(message.messageId);

    try {
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            const reply = "Please include your Shop Code (e.g., #SHP123) to use Munim AI. 🙏";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ system_response: reply, processing_status: 'processed' });
            return;
        }
        
        const shopCode = shopCodeMatch[1].toUpperCase();
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        const { shop, shopContext, success } = await loadShopAndContextByShopCode(shopCode);
        if (!success || !shop || !shopContext) {
            const reply = "Invalid Shop Code. Check your dashboard.";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ system_response: reply, processing_status: 'failed' });
            return;
        }

        // Layer 0: Deterministic Guard
        if (shop.status === 'locked' || shop.status === 'suspended') {
            const reply = "Account Locked. Please clear dues on your dashboard to continue. 💳";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({ system_response: reply, processing_status: 'processed' });
            return;
        }

        // Layer 1: Agent Execution (AI Fallback)
        const agentOutput = await anigravityAgent({ query: cleanedQuery, shopContext });

        // Boundary: Confidence Gate
        if (agentOutput.confidence < 0.75 || agentOutput.escalate) {
            const reply = "I'll confirm this with the shopkeeper. 🙂 (Confidence Low)";
            await sendWhatsAppMessage(message.from, reply);
            await interactionRef.update({
                processing_status: 'escalated',
                system_response: reply,
                decision_confidence: agentOutput.confidence,
                shop_context_snapshot: shopContext
            });
            return;
        }

        // Layer 2: Action Engine
        if (agentOutput.action) {
            // Inject shopId into payload if missing
            if (!agentOutput.action.payload.shopId) {
                agentOutput.action.payload.shopId = shopCode;
            }
            
            const result = await executeAction(agentOutput.action, { id: 'system', role: 'system' }, message.correlationId);
            if (result.message && !agentOutput.response) {
                agentOutput.response = result.message;
            }
        }

        if (agentOutput.response) {
            await sendWhatsAppMessage(message.from, agentOutput.response);
        }
        
        // Data Flywheel: Capture everything for future LLM training
        await interactionRef.update({
            processing_status: 'processed',
            system_response: agentOutput.response || null,
            detected_intent: agentOutput.intent,
            processing_path: 'ai_fallback',
            decision_confidence: agentOutput.confidence,
            response_time_ms: Date.now() - startTime,
            shop_context_snapshot: shopContext,
            extracted_entities: agentOutput.action?.payload || null
        });

    } catch (error) {
        console.error(`[MitraOS] Critical Processor Error [${message.correlationId}]:`, error);
        await interactionRef.update({ 
            processing_status: 'failed', 
            system_response: (error as Error).message 
        });
    }
}
