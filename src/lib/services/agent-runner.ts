
import { AgentInput, anigravityAgent } from '@/ai/flows/whatsapp-agent-flow';
import { loadShopAndContextByShopCode } from './context-loader';
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
        // 1. Extract Shop Code from message
        const shopCodeMatch = message.text.match(/#(\w+)/);
        if (!shopCodeMatch) {
            console.warn(`[AgentRunner] No shop code found in message from ${message.from}.`);
            await sendWhatsAppMessage(message.from, "Kripya shop code ke saath bill bhejein. Example: HI #SHP123");
            return;
        }
        const shopCode = shopCodeMatch[1];
        const cleanedQuery = message.text.replace(/#\w+\s*/, '').trim();

        // 2. Load Shop Context using the extracted code
        const contextResult = await loadShopAndContextByShopCode(shopCode);
        if (!contextResult.success || !contextResult.shopContext || !contextResult.shop) {
            console.error(`[AgentRunner] Could not load shop context for code #${shopCode}. Reason: ${contextResult.message}`);
            await sendWhatsAppMessage(message.from, "Sorry, this shop code is not valid. Please check and try again.");
            return;
        }

        // 3. HARDENED: Check if the shop's plan has expired.
        if (contextResult.shop.status === 'locked' || contextResult.shop.status === 'suspended') {
            console.log(`[AgentRunner] Shop ${shopCode} is locked. Blocking message processing.`);
            await sendWhatsAppMessage(message.from, "This shop's DukaanMitra plan has expired. Please contact the owner to continue service.");
            return;
        }

        // 4. Prepare Agent Input with the CLEANED query
        const agentInput: AgentInput = {
            query: cleanedQuery,
            shopContext: contextResult.shopContext,
        };

        // 5. Run the Anigravity Agent
        console.log(`[AgentRunner] Executing Anigravity agent for shop ${shopCode}...`);
        const agentOutput = await anigravityAgent(agentInput);
        console.log('[AgentRunner] Agent output received:', JSON.stringify(agentOutput, null, 2));


        // 6. Handle Agent Output (Action, Reply, Escalate)
        if (agentOutput.action && agentOutput.action.type === 'ADD_LEDGER_ENTRY') {
            const { customer } = agentOutput.action.payload;

            if (!customer.phone) {
                console.warn('[AgentRunner] Ledger entry action received without a customer phone number.');
                await sendWhatsAppMessage(message.from, "Customer ka 10-digit phone number samajh nahi aaya. Please try again.");
                return;
            }

            // The runner enriches the payload with RUNTIME info, like whether the customer is new.
            const customerRef = doc(firestore, 'shops', shopCode, 'customers', customer.phone);
            const customerDoc = await getDoc(customerRef);

            agentOutput.action.payload.shopId = shopCode; // Ensure shopId is in payload
            agentOutput.action.payload.customer.isNew = !customerDoc.exists();
            
            await executeAction(agentOutput.action);

        } else if (agentOutput.action) {
            agentOutput.action.payload.shopId = shopCode; // Ensure shopId is in payload
            await executeAction(agentOutput.action);
        }

        if (agentOutput.response) {
            await sendWhatsAppMessage(message.from, agentOutput.response);
        }

        if (agentOutput.escalate) {
            console.log(`[AgentRunner] ESCALATION for shop ${shopCode}: Reason: ${agentOutput.escalation_reason}. Message: "${message.text}"`);
        }

    } catch (error) {
        console.error('[AgentRunner] Unhandled error during agent execution:', error);
        await sendWhatsAppMessage(message.from, "Sorry, an unexpected error occurred. Please try again later.");
    }
}
