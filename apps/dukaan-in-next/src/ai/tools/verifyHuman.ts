// src/ai/tools/verifyHuman.ts

import { Tool } from "../types";

/**
 * Dummy human verification tool.
 * In a real project this could call the HoldVerificationGate component
 * or an external captcha service.
 */
export const verifyHumanTool: Tool<{}, { verified: boolean }> = {
  name: "verifyHuman",
  description: "Confirms that a human has passed the UI verification gate.",
  inputSchema: {},
  exampleInput: {},
  exampleOutput: { verified: true },
  handler: async () => {
    // Placeholder – always succeeds.
    return { verified: true };
  },
};
