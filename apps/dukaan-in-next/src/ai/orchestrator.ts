
import { AgentWorker } from "./agentWorker";
import { DeterministicAgent } from "./free/deterministic-agent";
import { AgentInput, AgentOutput } from "./schemas";
import { ai } from "./genkit";

/**
 * Orchestrator: The brain that decides which agent should handle the task.
 * It prioritizes "Model-Free" (Deterministic) agents for common tasks
 * to ensure free/low-cost and fast services.
 */
export class Orchestrator {
  /**
   * Main entry point for any agent task.
   */
  public static async execute(input: AgentInput): Promise<AgentOutput> {
    console.log(`[Orchestrator] Processing request: "${input.query}"`);

    // 1. Try Deterministic Agent (Free/Local)
    const deterministicResult = await DeterministicAgent.process(input);
    if (deterministicResult && deterministicResult.confidence > 0.9) {
      console.log(`[Orchestrator] Handled by DeterministicAgent (Model-Free)`);
      return deterministicResult;
    }

    // 2. Fallback to AI Agent (Reasoning required)
    console.log(`[Orchestrator] Falling back to AI Agent Worker`);
    const worker = new AgentWorker({ agentId: `orchestrator-${Date.now()}` });
    const aiResponse = await worker.run(input.query);

    // Convert worker string response to AgentOutput structure
    return {
      intent: 'unknown',
      confidence: 0.8,
      response: aiResponse,
      escalate: aiResponse.includes("error") || aiResponse.includes("limit")
    };
  }
}
