// src/ai/toolRegistry.ts

import { Tool } from "./types";

/** Simple in‑memory registry for all agent tools */
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  /** Register a new tool. Throws if name already exists. */
  register<TInput, TOutput>(tool: Tool<TInput, TOutput>) {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool \"${tool.name}\" is already registered`);
    }
    this.tools.set(tool.name, tool as Tool);
  }

  /** Retrieve a tool by name. Returns undefined if not found. */
  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /** List all registered tool names – useful for observability. */
  list(): string[] {
    return Array.from(this.tools.keys());
  }
}

/** Export a singleton that can be imported anywhere */
export const toolRegistry = new ToolRegistry();
