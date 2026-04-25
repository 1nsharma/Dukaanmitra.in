// src/ai/types.ts

/** Core interfaces for the autonomous agent framework */
export interface Tool<Input = any, Output = any> {
  /** Unique identifier for the tool */
  name: string;
  /** Human‑readable description used for tool selection */
  description: string;
  /** JSON schema describing the expected input */
  inputSchema: Record<string, any>;
  /** Example payload for documentation */
  exampleInput: Input;
  /** Example output for documentation */
  exampleOutput: Output;
  /** The function that actually runs the tool */
  handler: (input: Input) => Promise<Output>;
}

/** The agent’s internal thought */
export interface Thought {
  /** Natural‑language reasoning */
  reasoning: string;
  /** Optional plan steps */
  plan?: string[];
}

/** Action that the agent decides to take */
export interface Action {
  /** Name of the tool to invoke */
  toolName: string;
  /** Payload that conforms to the tool’s input schema */
  parameters: any;
}

/** Result coming back from a tool execution */
export interface Observation {
  /** The raw output from the tool */
  result: any;
  /** If the tool failed, an error message */
  error?: string;
}

/** Configuration for a worker instance */
export interface AgentConfig {
  /** Maximum REACT iterations before aborting */
  maxIterations?: number;
  /** Upper bound on estimated token cost (USD) */
  costCapUsd?: number;
  /** Optional identifier for logging */
  agentId?: string;
}
