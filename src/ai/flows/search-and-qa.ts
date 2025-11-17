'use server';

/**
 * @fileOverview Enables search across schedules, notes, and meeting minutes using natural language questions and receives accurate answers based on the stored information.
 *
 * - searchAndQA - A function that handles the search and question answering process.
 * - SearchAndQAInput - The input type for the searchAndQA function.
 * - SearchAndQAOutput - The return type for the searchAndQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchAndQAInputSchema = z.object({
  query: z.string().describe('The natural language query to search with.'),
  schedules: z.string().describe('The schedules to search through.'),
  notes: z.string().describe('The notes to search through.'),
  meetingMinutes: z.string().describe('The meeting minutes to search through.'),
});
export type SearchAndQAInput = z.infer<typeof SearchAndQAInputSchema>;

const SearchAndQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the query based on the search results.'),
});
export type SearchAndQAOutput = z.infer<typeof SearchAndQAOutputSchema>;

export async function searchAndQA(input: SearchAndQAInput): Promise<SearchAndQAOutput> {
  return searchAndQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchAndQAPrompt',
  model: 'gemini-pro',
  input: {schema: SearchAndQAInputSchema},
  output: {schema: SearchAndQAOutputSchema},
  prompt: `You are a search and question answering expert.

  You will receive a query and a set of schedules, notes, and meeting minutes.
  You will search through the schedules, notes, and meeting minutes to find the answer to the query.
  You will then return the answer to the query.

  Query: {{{query}}}
  Schedules: {{{schedules}}}
  Notes: {{{notes}}}
  Meeting Minutes: {{{meetingMinutes}}}
  `,
});

const searchAndQAFlow = ai.defineFlow(
  {
    name: 'searchAndQAFlow',
    inputSchema: SearchAndQAInputSchema,
    outputSchema: SearchAndQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
