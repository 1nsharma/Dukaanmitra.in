// src/ai/index.ts

/**
 * Entry point for the AI subsystem.
 * Import this file once (e.g., from _app.tsx) to make sure all tools are
 * registered before any agent runs.
 */
import { toolRegistry } from "./toolRegistry";
import { verifyHumanTool } from "./tools/verifyHuman";
import { shopSearchTool } from "./tools/shopSearch";
import { Orchestrator } from "./orchestrator";
import { AgentTrainer } from "./training/agent-trainer";
import { DeterministicAgent } from "./free/deterministic-agent";

export { Orchestrator, AgentTrainer, DeterministicAgent };

// Register core tools – add new imports above and call register() here.
export function registerAiTools() {
  try {
    toolRegistry.register(verifyHumanTool);
    toolRegistry.register(shopSearchTool);
    // future tools can be added similarly
  } catch (e) {
    // Duplicate registration is harmless; just log.
    console.warn("AI tool registration error:", e);
  }
}

// Auto‑register when the module is loaded – safe for serverless environments.
registerAiTools();
