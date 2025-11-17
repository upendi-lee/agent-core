'use server';

/**
 * @fileOverview A flow for classifying a user's command into a specific category.
 *
 * - classifyCommand - A function that classifies the command.
 * - ClassifyCommandInput - The input type for the classifyCommand function.
 * - ClassifyCommandOutput - The return type for the classifyCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const ClassifyCommandInputSchema = z.object({
  command: z.string().describe('The user\'s natural language command.'),
});
export type ClassifyCommandInput = z.infer<typeof ClassifyCommandInputSchema>;

const ClassifyCommandOutputSchema = z.object({
  category: z
    .enum(['SCHEDULE', 'NOTES', 'TASKS', 'MEETINGS', 'BRIEFING', 'UNKNOWN'])
    .describe('The classified category of the command.'),
});
export type ClassifyCommandOutput = z.infer<
  typeof ClassifyCommandOutputSchema
>;

export async function classifyCommand(
  input: ClassifyCommandInput
): Promise<ClassifyCommandOutput> {
  return classifyCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyCommandPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: ClassifyCommandInputSchema},
  output: {schema: ClassifyCommandOutputSchema},
  prompt: `You are a command classification expert. Your task is to classify the user's command into one of the following categories: SCHEDULE, NOTES, TASKS, MEETINGS, BRIEFING.

- SCHEDULE: Anything related to creating, modifying, deleting, or asking about calendar events, appointments, or schedules.
- NOTES: Anything related to taking, saving, or retrieving notes or memos.
- TASKS: Anything related to to-do lists, adding tasks, or managing tasks.
- MEETINGS: Anything related to summarizing meetings, recording audio, or action items from a meeting.
- BRIEFING: Anything related to asking for a daily summary or briefing.

If the command does not fit into any of these categories, classify it as UNKNOWN.

Command: {{{command}}}

Based on the command, provide the most relevant category.`,
});

const classifyCommandFlow = ai.defineFlow(
  {
    name: 'classifyCommandFlow',
    inputSchema: ClassifyCommandInputSchema,
    outputSchema: ClassifyCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
