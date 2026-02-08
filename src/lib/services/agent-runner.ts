
import { AgentInput, anigravityAgent } from '@/ai/flows/whatsapp-agent-flow';
import { loadShopContextByWhatsappNumber } from './context-loader';
import { sendWhatsAppMessage } from './whatsapp';
import { executeAction } from './action-engine';
import { getDoc, doc } from 'firebase/firestore';
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
 * The main orchestrator for the AI Agent.
 * This function is triggered by the WhatsApp webhook handler.
 * It loads context, runs the agent, and triggers actions or replies.
 * @param message - The normalized message from the WhatsApp webhook.
 */
export async function runAgentForMessage(message: NormalizedMessage) {
    console.log(`[AgentRunner] Processing message from ${message.from}`);

    try {
        // 1. Load Shop Context
        const contextResult = await loadShopContextByWhatsappNumber(message.to);
        if (!contextResult.success || !contextResult.shopContext) {
            console.error(`[AgentRunner] Could not load shop context for ${message.to}. Reason: ${contextResult.message}`);
            // Potentially send a default error message back to the user
            await sendWhatsAppMessage(message.from, "Sorry, this shop is not configured correctly. Please contact the owner.");
            return;
        }

        // 2. Prepare Agent Input
        const agentInput: AgentInput = {
            query: message.text,
            shopContext: contextResult.shopContext,
        };

        // 3. Run the Anigravity Agent
        console.log('[AgentRunner] Executing Anigravity agent...');
        const agentOutput = await anigravityAgent(agentInput);
        console.log('[AgentRunner] Agent output received:', JSON.stringify(agentOutput, null, 2));


        // 4. Handle Agent Output (Action, Reply, Escalate)
        if (agentOutput.action) {
            // The agent decided to take a database action.

            // The agent's `parseTransaction` tool returns a partial customer object. We need to check if the customer is new.
            const customerRef = doc(firestore, 'shops', contextResult.shopContext.shop_id, 'customers', agentOutput.action.payload.customer_phone);
            const customerDoc = await getDoc(customerRef);

            // Enhance payload with isNew status for the Action Engine
            const fullActionPayload = {
                ...agentOutput.action.payload,
                customer: {
                    ...agentOutput.action.payload.customer,
                    isNew: !customerDoc.exists(),
                    phone: agentOutput.action.payload.customer_phone,
                },
                shopId: contextResult.shopContext.shop_id,
            };

            const actionWithIsNew = { ...agentOutput.action, payload: fullActionPayload };
            
            await executeAction(actionWithIsNew);
        }

        if (agentOutput.response) {
            // The agent generated a reply for the user.
            await sendWhatsAppMessage(message.from, agentOutput.response);
        }

        if (agentOutput.escalate) {
            // The agent decided to escalate to a human.
            // In a real system, this would trigger a notification (email, SMS, Push) to the shop owner.
            console.log(`[AgentRunner] ESCALATION: Reason: ${agentOutput.escalation_reason}. Message: "${message.text}"`);
            // We still send the agent's generated response, which is usually a safe "I'll ask the shopkeeper" message.
        }

    } catch (error) {
        console.error('[AgentRunner] Unhandled error during agent execution:', error);
        // Send a generic failure message to the user
        await sendWhatsAppMessage(message.from, "Sorry, an unexpected error occurred. Please try again later.");
    }
}
