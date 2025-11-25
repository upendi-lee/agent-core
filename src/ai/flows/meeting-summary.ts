'use server';
/**
 * @fileOverview Summarizes meeting audio, transcribes it, and extracts action items.
 *
 * - meetingSummary - A function that handles the meeting summary process.
 * - MeetingSummaryInput - The input type for the meetingSummary function.
 * - MeetingSummaryOutput - The return type for the meetingSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { saveToDrive } from '@/lib/google';

const MeetingSummaryInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Meeting audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type MeetingSummaryInput = z.infer<typeof MeetingSummaryInputSchema>;

const MeetingSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the meeting.'),
  actionItems: z.array(z.string()).describe('A list of action items extracted from the meeting.'),
  driveFileId: z.string().optional().describe('The ID of the file saved to Google Drive.'),
});
export type MeetingSummaryOutput = z.infer<typeof MeetingSummaryOutputSchema>;

export async function meetingSummary(input: MeetingSummaryInput): Promise<MeetingSummaryOutput> {
  return meetingSummaryFlow(input);
}

const meetingSummaryPrompt = ai.definePrompt({
  name: 'meetingSummaryPrompt',
  model: 'gemini-1.5-pro',
  input: { schema: z.object({ transcript: z.string() }) },
  output: { schema: MeetingSummaryOutputSchema },
  prompt: `You are an AI assistant tasked with summarizing meetings and extracting action items.

  Analyze the following meeting transcript and provide a concise summary, followed by a list of action items.

  Transcript: {{transcript}}

  Summary:
  Action Items:`,
});

const meetingSummaryFlow = ai.defineFlow(
  {
    name: 'meetingSummaryFlow',
    inputSchema: MeetingSummaryInputSchema,
    outputSchema: MeetingSummaryOutputSchema,
  },
  async (input) => {
    const { text: transcript } = await ai.generate({
      model: 'gemini-1.5-pro',
      prompt: [
        {
          media: {
            url: input.audioDataUri,
          },
        },
        {
          text: 'Transcribe this audio. If the audio is in Korean, provide the transcription in Korean.',
        },
      ],
    });

    const { output } = await meetingSummaryPrompt({
      transcript,
    });

    if (!output) {
      throw new Error("Failed to generate summary.");
    }

    // Save to Google Drive
    try {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      const filename = `회의록${month}${day}${hour}${minute}`;

      const content = `Summary:\n${output.summary}\n\nAction Items:\n${output.actionItems.join('\n- ')}\n\nTranscript:\n${transcript}`;

      const fileId = await saveToDrive(content, filename);
      output.driveFileId = fileId;
    } catch (error) {
      console.error("Failed to save to Google Drive:", error);
      // We don't fail the whole flow if Drive saving fails, but we log it.
    }

    return output;
  }
);
