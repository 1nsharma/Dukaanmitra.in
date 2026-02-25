'use server';
/**
 * @fileOverview The DukaanMitra AI Orchestrator Pipeline.
 * Implements a HANDLE -> TRANSFORM -> DELIVER architecture with specialized agents.
 * 
 * - Benjamin: Logic, Calculations, Automation
 * - Harper: Facts, Compliance, Best Practices
 * - Lucas: UX, Simplicity, Business Clarity
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { 
  OrchestratorInputSchema, 
  OrchestratorOutputSchema,
  type OrchestratorInput,
  type OrchestratorOutput
} from '@/ai/schemas';

// --- AGENT PROMPTS ---

const orchestratorBrainPrompt = ai.definePrompt({
  name: 'orchestratorBrainPrompt',
  input: { schema: z.string() },
  output: { schema: z.object({
    logicTask: z.string(),
    researchTask: z.string(),
    creativeTask: z.string()
  })},
  prompt: `You are the DukaanMitra AI Orchestrator.
  Break this request into specialized tasks for your agents:
  Request: "{{input}}"
  
  1. Benjamin (Logic/Code): Complex calculations or system design.
  2. Harper (Research): Compliance, standards, facts.
  3. Lucas (UX/Clarity): Human messaging and Kirana-friendly flow.
  `
});

const benjaminPrompt = ai.definePrompt({
  name: 'benjaminPrompt',
  input: { schema: z.string() },
  output: { schema: z.string() },
  prompt: `You are Benjamin — logic and system engineer for DukaanMitra.
  Focus on architecture, automation, and data logic.
  Task: {{input}}`
});

const harperPrompt = ai.definePrompt({
  name: 'harperPrompt',
  input: { schema: z.string() },
  output: { schema: z.string() },
  prompt: `You are Harper — research and compliance expert for Indian SaaS.
  Focus on best practices and risk detection.
  Task: {{input}}`
});

const lucasPrompt = ai.definePrompt({
  name: 'lucasPrompt',
  input: { schema: z.string() },
  output: { schema: z.string() },
  prompt: `You are Lucas — UX and Kirana business clarity expert.
  Focus on simplicity and human-friendly messaging.
  Task: {{input}}`
});

const mergerPrompt = ai.definePrompt({
  name: 'mergerPrompt',
  input: { schema: z.object({
    logic: z.string(),
    research: z.string(),
    creative: z.string(),
    originalMessage: z.string()
  })},
  output: { schema: OrchestratorOutputSchema },
  prompt: `Merge these expert perspectives into a single practical response for a Kirana owner.
  Original: {{originalMessage}}
  Benjamin (Logic): {{logic}}
  Harper (Research): {{research}}
  Lucas (UX): {{creative}}
  
  Optimize for Indian small business usability. Actionable and friendly.`
});

// --- MAIN FLOW ---

export async function orchestrateAI(input: OrchestratorInput): Promise<OrchestratorOutput> {
  return orchestratorFlow(input);
}

const orchestratorFlow = ai.defineFlow(
  {
    name: 'orchestratorFlow',
    inputSchema: OrchestratorInputSchema,
    outputSchema: OrchestratorOutputSchema,
  },
  async (input) => {
    // 1. HANDLE & SPLIT
    const { output: tasks } = await orchestratorBrainPrompt(input.message);
    if (!tasks) throw new Error("Orchestrator failed to split tasks.");

    // 2. TRANSFORM (Parallel Agent Execution)
    const [logicRes, researchRes, creativeRes] = await Promise.all([
      benjaminPrompt(tasks.logicTask),
      harperPrompt(tasks.researchTask),
      lucasPrompt(tasks.creativeTask)
    ]);

    // 3. MERGE
    const { output: finalResult } = await mergerPrompt({
      logic: logicRes.output || "N/A",
      research: researchRes.output || "N/A",
      creative: creativeRes.output || "N/A",
      originalMessage: input.message
    });

    if (!finalResult) throw new Error("Merger failed to generate output.");

    // 4. DELIVER (Store & Return)
    try {
      const historyRef = adminDb.collection('users').doc(input.userId).collection('ai_history').doc();
      await historyRef.set({
        id: historyRef.id,
        original_message: input.message,
        ...finalResult,
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch (e) {
      console.error("[Orchestrator] Failed to save to history:", e);
    }

    return finalResult;
  }
);
