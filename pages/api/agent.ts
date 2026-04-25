// pages/api/agent.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { AgentSupervisor } from "../../src/ai/supervisor";

/**
 * POST { prompt: string } → { answer: string }
 * Simple wrapper around AgentSupervisor. Errors are returned with 400/500.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body ?? {};
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Missing or empty 'prompt' in request body" });
  }

  // 1. Safety Guardrail: Prompt Injection Detection
  const injectionPatterns = [
    /ignore previous/i,
    /bypass rules/i,
    /system prompt/i,
    /forget all/i
  ];
  if (injectionPatterns.some(pattern => pattern.test(prompt))) {
    console.warn("Safety Error: Potential prompt injection detected.");
    return res.status(400).json({ error: "Safety violation: Malicious prompt detected." });
  }

  // 2. Safety Guardrail: PII Detection (Basic)
  const piiPatterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // US Phone
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
    /\b(?:\d[ -]*?){13,16}\b/ // Credit Card
  ];
  if (piiPatterns.some(pattern => pattern.test(prompt))) {
    console.warn("Safety Error: PII detected in prompt.");
    return res.status(400).json({ error: "Safety violation: PII detected. Please do not share sensitive information." });
  }

  // 3. Rate Limiting (Mock implementation)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  // In a real app, use Redis or similar for rate limiting. Here we just mock it.
  const globalAny = global as any;
  if (globalAny.rateLimitCache && globalAny.rateLimitCache[clientIp as string] > 10) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }
  globalAny.rateLimitCache = globalAny.rateLimitCache || {};
  globalAny.rateLimitCache[clientIp as string] = (globalAny.rateLimitCache[clientIp as string] || 0) + 1;

  try {
    const supervisor = new AgentSupervisor();
    
    // 4. Timeout to prevent hanging request
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout: Agent took too long to respond")), 20000);
    });

    const answer = await Promise.race([
      supervisor.handle(prompt),
      timeoutPromise
    ]);

    return res.status(200).json({ answer });
  } catch (e: any) {
    console.error("Agent error:", e);
    // Graceful degradation / fallback pattern
    if (e.message.includes("timeout")) {
      return res.status(504).json({ error: "The AI agent took too long to process your request. Please try again." });
    }
    return res.status(500).json({ error: e?.message ?? "Internal server error" });
  }
}

