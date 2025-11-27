'use server';

/**
 * @fileOverview A flow for classifying a user's command into a specific category.
 *
 * - classifyCommand - A function that classifies the command.
 * - ClassifyCommandInput - The input type for the classifyCommand function.
 * - ClassifyCommandOutput - The return type for the classifyCommand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClassifyCommandInputSchema = z.object({
  command: z.string().describe("The user's natural language command."),
});
export type ClassifyCommandInput = z.infer<typeof ClassifyCommandInputSchema>;

const ClassifyCommandOutputSchema = z.object({
  category: z
    .enum(['SCHEDULE', 'SCHEDULE_QUERY', 'NOTES', 'TASKS', 'MEETINGS', 'BRIEFING', 'HEALTH', 'MAIL', 'WEATHER', 'PROJECT', 'UNKNOWN'])
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
  model: 'googleai/gemini-2.0-flash-001',
  input: { schema: ClassifyCommandInputSchema },
  output: { schema: ClassifyCommandOutputSchema },
  prompt: `You are a command classification expert. Your task is to classify the user's command into one of the following categories: SCHEDULE, SCHEDULE_QUERY, NOTES, TASKS, MEETINGS, BRIEFING, HEALTH, MAIL, WEATHER, PROJECT.

- SCHEDULE: **ONLY** for creating, modifying, or deleting calendar events. Examples: "schedule a meeting", "add an event", "change the time", "delete appointment". **NEVER** classify questions about existing schedules here.
- SCHEDULE_QUERY: **ONLY** for asking about existing schedules. Examples: "what is my schedule today", "show me my appointments", "do I have any meetings?", "오늘 일정 알려줘", "내일 스케줄 보여줘", "일정 보여줘".
- NOTES: Anything related to taking, saving, or retrieving notes or memos.
- TASKS: Anything related to to-do lists, adding tasks, or managing tasks.
- MEETINGS: Anything related to summarizing meetings, recording audio, or action items from a meeting.
- BRIEFING: Anything related to asking for a daily summary or briefing.
- HEALTH: Anything related to health tracking, exercise, diet, or sleep.
- MAIL: Anything related to checking, sending, or managing emails.
- WEATHER: Anything related to checking the weather forecast.
- PROJECT: Anything related to project management, creating new projects, or tracking progress.

If the command does not fit into any of these categories, classify it as UNKNOWN.

Command: {{command}}

Based on the command, provide the most relevant category.`,
});

const classifyCommandFlow = ai.defineFlow(
  {
    name: 'classifyCommandFlow',
    inputSchema: ClassifyCommandInputSchema,
    outputSchema: ClassifyCommandOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
