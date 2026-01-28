'use server';

/**
 * @fileOverview Provides an AI-powered chat assistant for interactive product demos.
 *
 * - interactiveAIDemo - A function to initiate the AI demo with a user query.
 * - InteractiveAIDemoInput - The input type for the interactiveAIDemo function.
 * - InteractiveAIDemoOutput - The return type for the interactiveAIDemo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveAIDemoInputSchema = z.object({
  query: z.string().describe('The user query for the product demo.'),
});
export type InteractiveAIDemoInput = z.infer<typeof InteractiveAIDemoInputSchema>;

const InteractiveAIDemoOutputSchema = z.object({
  response: z.string().describe('The AI response to the user query.'),
});
export type InteractiveAIDemoOutput = z.infer<typeof InteractiveAIDemoOutputSchema>;

export async function interactiveAIDemo(input: InteractiveAIDemoInput): Promise<InteractiveAIDemoOutput> {
  return interactiveAIDemoFlow(input);
}

const interactiveAIDemoPrompt = ai.definePrompt({
  name: 'interactiveAIDemoPrompt',
  input: {schema: InteractiveAIDemoInputSchema},
  output: {schema: InteractiveAIDemoOutputSchema},
  prompt: `You are a helpful AI assistant providing interactive product demos for DukaanMitra, a platform designed to help Kirana store owners. Answer the following question about the product:

  {{query}}
`,
});

const interactiveAIDemoFlow = ai.defineFlow(
  {
    name: 'interactiveAIDemoFlow',
    inputSchema: InteractiveAIDemoInputSchema,
    outputSchema: InteractiveAIDemoOutputSchema,
  },
  async input => {
    const {output} = await interactiveAIDemoPrompt(input);
    return output!;
  }
);
