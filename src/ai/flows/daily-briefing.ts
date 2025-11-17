'use server';

/**
 * @fileOverview A flow for generating a proactive daily briefing, summarizing schedules, to-do lists, and important notes.
 *
 * - generateDailyBriefing - A function that generates the daily briefing.
 * - DailyBriefingInput - The input type for the generateDailyBriefing function.
 * - DailyBriefingOutput - The return type for the generateDailyBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyBriefingInputSchema = z.object({
  schedules: z.string().describe('A summary of the user\'s schedule for the day.'),
  toDoLists: z.string().describe('A summary of the user\'s to-do lists for the day.'),
  importantNotes: z.string().describe('A summary of the user\'s important notes for the day.'),
});
export type DailyBriefingInput = z.infer<typeof DailyBriefingInputSchema>;

const DailyBriefingOutputSchema = z.object({
  briefing: z.string().describe('A comprehensive daily briefing summarizing schedules, to-do lists, and important notes.'),
});
export type DailyBriefingOutput = z.infer<typeof DailyBriefingOutputSchema>;

export async function generateDailyBriefing(input: DailyBriefingInput): Promise<DailyBriefingOutput> {
  return dailyBriefingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyBriefingPrompt',
  input: {schema: DailyBriefingInputSchema},
  output: {schema: DailyBriefingOutputSchema},
  prompt: `You are an AI assistant that provides a concise and helpful daily briefing to users.  The briefing summarizes the user\'s schedule, to-do list, and important notes for the day.

  Schedule: {{{schedules}}}

  To-Do List: {{{toDoLists}}}

  Important Notes: {{{importantNotes}}}

  Please generate a daily briefing that integrates these three pieces of information into one cohesive summary. Focus on providing actionable insights to help the user plan their day effectively.
  `,
});

const dailyBriefingFlow = ai.defineFlow(
  {
    name: 'dailyBriefingFlow',
    inputSchema: DailyBriefingInputSchema,
    outputSchema: DailyBriefingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
