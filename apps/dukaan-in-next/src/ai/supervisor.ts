// src/ai/supervisor.ts

import { AgentWorker } from "./agentWorker";
import { MemoryManager } from "./memoryManager";

/**
 * AgentSupervisor decides whether a single AgentWorker can solve a request or
 * whether it needs to spawn specialist workers. For now we keep it simple –
 * always use a single worker. The class is designed for future expansion
 * (e.g., task decomposition, delegating to specialist agents).
 */
export class AgentSupervisor {
  private memory: MemoryManager;

  constructor() {
    this.memory = new MemoryManager();
  }

  /**
   * Handle a user prompt and return the final answer.
   * In a full implementation this would first attempt to plan, then possibly
   * create child agents. Here we just run one AgentWorker.
   */
  async handle(prompt: string): Promise<string> {
    const worker = new AgentWorker({ agentId: `supervisor-${Date.now()}` });
    // Optionally seed the worker with shared memory – omitted for brevity.
    const answer = await worker.run(prompt);
    return answer;
  }
}
