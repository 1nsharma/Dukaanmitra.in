// src/ai/agentWorker.ts

import { Tool, Thought, Action, Observation, AgentConfig } from "./types";
import { toolRegistry } from "./toolRegistry";
import { MemoryManager } from "./memoryManager";
import { ai } from "./genkit";
import { gemini15Flash } from "@genkit-ai/google-genai";
import { z } from "zod";

const ThoughtSchema = z.object({
  reasoning: z.string(),
  plan: z.array(z.string()).optional()
});

const ActionSchema = z.object({
  toolName: z.string(),
  parameters: z.record(z.any())
});

/** Simple JSON logger – in a real project replace with Winston/Loki etc. */
function logEvent(event: Record<string, any>) {
  if (typeof console !== "undefined") {
    console.log(JSON.stringify(event));
  }
}

/**
 * AgentWorker runs a REACT‑style loop:
 *   Thought → Action → Observation
 * It stops when the LLM returns a final answer (no action) or when limits are hit.
 */
export class AgentWorker {
  private config: Required<AgentConfig>;
  private memory: MemoryManager;

  constructor(config?: AgentConfig) {
    this.config = {
      maxIterations: config?.maxIterations ?? 12,
      costCapUsd: config?.costCapUsd ?? 0.01,
      agentId: config?.agentId ?? `agent-${Date.now()}`,
    };
    this.memory = new MemoryManager();
  }

  /** Core entry point */
  async run(userPrompt: string): Promise<string> {
    let iteration = 0;
    let totalCost = 0;
    const context: string[] = [];
    // Seed context with user prompt
    context.push(`User: ${userPrompt}`);

    while (iteration < this.config.maxIterations) {
      iteration++;
      // -----------------------------------------------------------------
      // 1️⃣ Thought – ask the LLM to reason about the next step.
      // -----------------------------------------------------------------
      let thought: Thought;
      try {
        const result = await this.invokeLLMWithRetry(context, "thought");
        thought = result.data as Thought;
        totalCost += result.cost;
      } catch (error: any) {
        logEvent({ type: "error", agentId: this.config.agentId, iteration, message: "Thought generation failed", error: error.message });
        return "Sorry, I encountered an internal error reasoning about your request.";
      }

      logEvent({
        type: "thought",
        agentId: this.config.agentId,
        iteration,
        reasoning: thought.reasoning,
        plan: thought.plan,
      });
      this.memory.setWorking("lastThought", thought);

      // If the LLM decided to finish, it will not provide an action field.
      if (!thought.plan || thought.plan.length === 0) {
        logEvent({ type: "final", agentId: this.config.agentId, answer: thought.reasoning, totalCost });
        return thought.reasoning;
      }

      // -----------------------------------------------------------------
      // 2️⃣ Action – LLM chooses a tool and parameters.
      // -----------------------------------------------------------------
      let action: Action;
      try {
        const result = await this.invokeLLMWithRetry(context, "action");
        action = result.data as Action;
        totalCost += result.cost;
      } catch (error: any) {
        logEvent({ type: "error", agentId: this.config.agentId, iteration, message: "Action generation failed", error: error.message });
        return "Sorry, I encountered an internal error trying to determine the next action.";
      }

      logEvent({ type: "action", agentId: this.config.agentId, iteration, action });

      const tool = toolRegistry.get(action.toolName);
      if (!tool) {
        const err = `Tool \"${action.toolName}\" not found`;
        logEvent({ type: "error", agentId: this.config.agentId, iteration, error: err });
        return err;
      }

      // -----------------------------------------------------------------
      // 3️⃣ Observation – Execute the tool safely.
      // -----------------------------------------------------------------
      let observation: Observation;
      try {
        const result = await tool.handler(action.parameters);
        observation = { result };
      } catch (e: any) {
        observation = { result: null, error: e.message };
        logEvent({ type: "tool_error", agentId: this.config.agentId, iteration, tool: tool.name, error: e.message });
      }
      logEvent({ type: "observation", agentId: this.config.agentId, iteration, tool: tool.name, observation });

      context.push(`Tool ${tool.name} output: ${JSON.stringify(observation)}`);

      if (totalCost > this.config.costCapUsd) {
        const limitMsg = `Cost limit reached (${totalCost.toFixed(4)} USD). Stopping execution.`;
        logEvent({ type: "cost_limit", agentId: this.config.agentId, message: limitMsg });
        return limitMsg;
      }
    }

    const timeoutMsg = `Reached max iterations (${this.config.maxIterations}) without a final answer.`;
    logEvent({ type: "timeout", agentId: this.config.agentId, message: timeoutMsg });
    return timeoutMsg;
  }

  /**
   * Circuit breaker implementation for LLM invocation
   */
  private async invokeLLMWithRetry(context: string[], mode: "thought" | "action"): Promise<{ data: any, cost: number }> {
    let attempts = 0;
    while (attempts < 3) {
      try {
        return await this.invokeLLM(context, mode);
      } catch (error: any) {
        attempts++;
        logEvent({ type: "llm_retry", agentId: this.config.agentId, attempt: attempts, error: error.message });
        if (attempts >= 3) {
          throw new Error(`LLM call failed after 3 attempts: ${error.message}`);
        }
        await new Promise(res => setTimeout(res, 1000 * attempts));
      }
    }
    throw new Error("invokeLLMWithRetry failed");
  }

  /**
   * Invokes the LLM using Genkit and records cost/usage.
   */
  private async invokeLLM(context: string[], mode: "thought" | "action"): Promise<{ data: any, cost: number }> {
    const prompt = `You are an autonomous AI agent.
Available tools: ${toolRegistry.list().join(", ")}.

Conversation History:
${context.join("\n")}

Respond as a ${mode}.`;

    const schema = mode === "thought" ? ThoughtSchema : ActionSchema;

    const response = await ai.generate({
      model: gemini15Flash,
      prompt,
      output: { schema }
    });

    // Estimate cost based on Genkit usage data
    // (Assuming rough Gemini 1.5 Flash pricing: $0.075/1M input, $0.30/1M output tokens)
    const usage = response.usage || { inputCharacters: 0, outputCharacters: 0, inputTokens: 0, outputTokens: 0 };
    const cost = ((usage.inputTokens || 0) * 0.000000075) + ((usage.outputTokens || 0) * 0.00000030);

    logEvent({
      type: "llm_usage",
      agentId: this.config.agentId,
      model: "gemini15Flash",
      usage,
      cost
    });

    return { data: response.output, cost };
  }
}
