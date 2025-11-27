'use server';

/**
 * @fileOverview Extracts structured information from natural language input.
 *
 * - extractInfo - A function that extracts title, date, time, and category from user input.
 * - ExtractInfoInput - The input type for the extractInfo function.
 * - ExtractInfoOutput - The return type for the extractInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractInfoInputSchema = z.object({
    userInput: z.string().describe('Natural language input from the user.'),
});
export type ExtractInfoInput = z.infer<typeof ExtractInfoInputSchema>;

const ExtractInfoOutputSchema = z.object({
    category: z
        .enum(['SCHEDULE', 'NOTE', 'TASK', 'SCHEDULE_QUERY', 'BRIEFING'])
        .describe('The category of the input: SCHEDULE for events/appointments, NOTE for notes/memos, TASK for to-dos, SCHEDULE_QUERY for asking about schedules, BRIEFING for daily summaries.'),
    title: z.string().describe('The extracted title or main subject.'),
    date: z.string().optional().describe('The extracted date in YYYY-MM-DD format. Use relative dates like "today", "tomorrow" and convert to actual dates.'),
    startTime: z.string().optional().describe('The extracted start time in HH:mm format (24-hour).'),
    endTime: z.string().optional().describe('The extracted end time in HH:mm format (24-hour). If not specified, default to 1 hour after start time.'),
    description: z.string().optional().describe('Additional details or description.'),
});
export type ExtractInfoOutput = z.infer<typeof ExtractInfoOutputSchema>;

export async function extractInfo(input: ExtractInfoInput): Promise<ExtractInfoOutput> {
    return extractInfoFlow(input);
}

const prompt = ai.definePrompt({
    name: 'extractInfoPrompt',
    model: 'googleai/gemini-2.0-flash-001',
    input: {
        schema: z.object({
            userInput: z.string(),
            currentDate: z.string(),
        })
    },
    output: { schema: ExtractInfoOutputSchema },
    prompt: `You are an intelligent assistant that extracts structured information from natural language input.

Your task is to analyze the user's input and extract:
1. **Category**: Determine if this is a:
   - **SCHEDULE**: Creating, modifying, or deleting an event (e.g., "add meeting", "schedule call").
   - **SCHEDULE_QUERY**: Asking to see or list existing events (e.g., "show schedule", "what do I have today", "오늘 일정 알려줘").
   - **BRIEFING**: Asking for a daily summary or briefing (e.g., "daily briefing", "summary of today", "브리핑 해줘", "오늘 브리핑").
   - **NOTE**: Recording a memo or idea.
   - **TASK**: Creating a to-do item.
2. **Title**: The main subject or title
3. **Date**: Extract the date if mentioned. Convert relative dates (today, tomorrow, next Monday, etc.) to YYYY-MM-DD format. Today is {{currentDate}}.
4. **Start Time**: Extract start time if mentioned, in HH:mm format (24-hour)
5. **End Time**: Extract end time if mentioned, or default to 1 hour after start time
6. **Description**: Any additional details

Examples:
- "내일 오후 2시에 팀 회의" → category: SCHEDULE, title: "팀 회의", date: (tomorrow's date), startTime: "14:00", endTime: "15:00"
- "프로젝트 아이디어: AI 기반 자동화" → category: NOTE, title: "프로젝트 아이디어", description: "AI 기반 자동화"
- "금요일까지 보고서 작성" → category: TASK, title: "보고서 작성", date: (next Friday's date)
- "오늘 일정 알려줘" → category: SCHEDULE_QUERY, title: "오늘 일정", date: (today's date)
- "브리핑 해줘" → category: BRIEFING, title: "데일리 브리핑", date: (today's date)

User Input: {{userInput}}
Current Date: {{currentDate}}

Extract the information and return it in the specified format.`,
});

const extractInfoFlow = ai.defineFlow(
    {
        name: 'extractInfoFlow',
        inputSchema: ExtractInfoInputSchema,
        outputSchema: ExtractInfoOutputSchema,
    },
    async (input) => {
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];

        const { output } = await prompt({
            userInput: input.userInput,
            currentDate,
        });

        return output!;
    }
);
