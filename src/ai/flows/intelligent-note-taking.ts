'use server';

/**
 * @fileOverview Implements the intelligent note-taking feature with automatic tag suggestions.
 *
 * - intelligentNoteTaking - The main function to process notes and suggest tags.
 * - IntelligentNoteTakingInput - Input type for the note-taking function.
 * - IntelligentNoteTakingOutput - Output type containing the processed note and suggested tags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentNoteTakingInputSchema = z.object({
  noteContent: z
    .string()
    .describe('The content of the note or diary entry, either from voice or text input.'),
});
export type IntelligentNoteTakingInput = z.infer<typeof IntelligentNoteTakingInputSchema>;

const IntelligentNoteTakingOutputSchema = z.object({
  processedNote: z.string().describe('The original note content.'),
  suggestedTags: z.array(z.string()).describe('An array of suggested tags based on keyword extraction.'),
});
export type IntelligentNoteTakingOutput = z.infer<typeof IntelligentNoteTakingOutputSchema>;

export async function intelligentNoteTaking(input: IntelligentNoteTakingInput): Promise<IntelligentNoteTakingOutput> {
  return intelligentNoteTakingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentNoteTakingPrompt',
  model: 'gemini-pro',
  input: {schema: IntelligentNoteTakingInputSchema},
  output: {schema: IntelligentNoteTakingOutputSchema},
  prompt: `You are an intelligent note-taking assistant. You will receive note content and suggest relevant tags based on keyword extraction from the note.

Note Content: {{{noteContent}}}

Suggest at least 3 tags that are most relevant to the note content. Return only suggested tags. Do not include explanations.

Output the processed note (unmodified) and suggested tags.

Format the tags as a JSON array of strings.`,
});

const intelligentNoteTakingFlow = ai.defineFlow(
  {
    name: 'intelligentNoteTakingFlow',
    inputSchema: IntelligentNoteTakingInputSchema,
    outputSchema: IntelligentNoteTakingOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
    });
    return output!;
  }
);
