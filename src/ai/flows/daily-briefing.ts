'use server';

/**
 * @fileOverview A flow for generating a proactive daily briefing, summarizing schedules, to-do lists, and important notes.
 *
 * - generateDailyBriefing - A function that generates the daily briefing.
 * - DailyBriefingInput - The input type for the generateDailyBriefing function.
 * - DailyBriefingOutput - The return type for the generateDailyBriefing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DailyBriefingInputSchema = z.object({
  schedules: z.string().describe("A summary of the user's schedule for the day."),
  toDoLists: z.string().describe("A summary of the user's to-do lists for the day."),
  importantNotes: z.string().describe("A summary of the user's important notes for the day."),
  currentDate: z.string().describe("The current date."),
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
  model: 'googleai/gemini-2.0-flash-001',
  input: { schema: DailyBriefingInputSchema },
  prompt: `You are an AI assistant that provides a comprehensive daily briefing.
  
  Current Date: {{currentDate}} (Please use this date for the briefing header)
  
  Data Provided:
  - Schedule: {{{schedules}}}
  - To-Do List: {{{toDoLists}}}
  - Important Notes: {{{importantNotes}}}

  Your goal is to generate a structured, engaging briefing in Markdown format.
  
  **Format Requirements:**
  1. **Header**: "🎙️ YUPI Daily Briefing" followed by the date and a friendly greeting.
  2. **Timeline**: A chronological list of today's events. Use emojis (📅, 🔴, 🍱, 🤝, 💻, 💪). If there are gaps, suggest focus time.
  3. **Notifications**: Summarize urgent tasks or unread items (simulated if not provided).
  4. **Weather**: Provide a brief weather forecast (simulated based on season/date if real data is missing).
  5. **Tone**: Professional yet friendly and motivating.

  **Example Output:**
  
  # 🎙️ YUPI Daily Briefing
  **2025년 11월 27일 (목)** | 현재 시각 09:00 AM

  반갑습니다, 사용자님. 오늘 예정된 주요 일정과 체크리스트를 요약해 드립니다.

  ## 📅 오늘의 타임라인 (Timeline)
  **[진행 중] 10:00 AM - 11:00 AM**
  🔴 **주간 스프린트 회의** (대회의실 A)
  > Note: 개발팀 이슈 트래킹 점검 필요

  **12:30 PM - 13:30 PM**
  🍱 **팀 점심 식사** (버거킹)

  ## 🔔 알림 (Notifications)
  - ✅ **우선순위 할 일**: 'Next.js 마이그레이션'
  - 📧 **읽지 않은 메일**: 3건 (긴급: 디자인 시안)

  ## 🌧️ 날씨
  오후 늦게 비 소식이 있습니다. 우산을 챙기세요.

  "다음 명령을 말씀해 주시면, 즉시 실행하겠습니다."
  `,
});

const dailyBriefingFlow = ai.defineFlow(
  {
    name: 'dailyBriefingFlow',
    inputSchema: DailyBriefingInputSchema,
    outputSchema: DailyBriefingOutputSchema,
  },
  async input => {
    const { text } = await prompt(input);
    return { briefing: text };
  }
);
