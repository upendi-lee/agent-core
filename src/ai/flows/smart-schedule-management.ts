'use server';

/**
 * @fileOverview This file defines the Genkit flow for smart schedule management.
 *
 * - createSchedule - A function that creates a schedule using natural language input.
 * - getSchedule - A function that retrieves a schedule.
 * - modifySchedule - A function that modifies a schedule.
 * - deleteSchedule - A function that deletes a schedule.
 * - SmartScheduleInput - The input type for the schedule functions.
 * - SmartScheduleOutput - The return type for the schedule functions.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const SmartScheduleInputSchema = z.object({
  action: z
    .string()
    .describe(
      'The action to perform on the schedule (create, retrieve, modify, delete).'
    ),
  description: z
    .string()
    .describe(
      'A detailed description of the schedule, including constraints and preferences.'
    ),
  calendarId: z.string().optional().describe('The google calendar id.'),
});
export type SmartScheduleInput = z.infer<typeof SmartScheduleInputSchema>;

const SmartScheduleOutputSchema = z.object({
  success: z.boolean().describe('Whether the schedule action was successful.'),
  message: z.string().describe('A message indicating the result of the action.'),
  scheduleDetails: z.record(z.any()).optional().describe('Details of the schedule, if available.'),
});
export type SmartScheduleOutput = z.infer<typeof SmartScheduleOutputSchema>;

export async function createSchedule(input: SmartScheduleInput): Promise<SmartScheduleOutput> {
  return smartScheduleManagementFlow(input);
}

export async function getSchedule(input: SmartScheduleInput): Promise<SmartScheduleOutput> {
  return smartScheduleManagementFlow(input);
}

export async function modifySchedule(input: SmartScheduleInput): Promise<SmartScheduleOutput> {
  return smartScheduleManagementFlow(input);
}

export async function deleteSchedule(input: SmartScheduleInput): Promise<SmartScheduleOutput> {
  return smartScheduleManagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartScheduleManagementPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: SmartScheduleInputSchema},
  output: {schema: SmartScheduleOutputSchema},
  prompt: `You are a smart schedule management assistant.

  The user will provide a natural language description of an action to perform on a schedule, along with any constraints or preferences.
  Your goal is to understand the user's intent and perform the requested action, providing a confirmation message and relevant schedule details.

  Here's the action the user wants to perform:
  Action: {{{action}}}

  Here's the description of the schedule, including constraints and preferences:
  Description: {{{description}}}

  Respond in a JSON format with a "success" boolean, a "message" string, and optional "scheduleDetails" (in JSON format) field.
  If the action is successful, set "success" to true and provide a confirmation message.
  If the action fails, set "success" to false and provide an error message.
  The calendar ID is {{{calendarId}}}.
  `,
});

const smartScheduleManagementFlow = ai.defineFlow(
  {
    name: 'smartScheduleManagementFlow',
    inputSchema: SmartScheduleInputSchema,
    outputSchema: SmartScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
