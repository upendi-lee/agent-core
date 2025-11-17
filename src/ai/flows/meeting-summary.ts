'use server';
/**
 * @fileOverview Summarizes meeting audio, transcribes it, and extracts action items.
 *
 * - meetingSummary - A function that handles the meeting summary process.
 * - MeetingSummaryInput - The input type for the meetingSummary function.
 * - MeetingSummaryOutput - The return type for the meetingSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const MeetingSummaryInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'Meeting audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Fixed typo here
    ),
});
export type MeetingSummaryInput = z.infer<typeof MeetingSummaryInputSchema>;

const MeetingSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the meeting.'),
  actionItems: z.array(z.string()).describe('A list of action items extracted from the meeting.'),
});
export type MeetingSummaryOutput = z.infer<typeof MeetingSummaryOutputSchema>;

export async function meetingSummary(input: MeetingSummaryInput): Promise<MeetingSummaryOutput> {
  return meetingSummaryFlow(input);
}

const meetingSummaryPrompt = ai.definePrompt({
  name: 'meetingSummaryPrompt',
  input: {schema: MeetingSummaryInputSchema},
  output: {schema: MeetingSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing meetings and extracting action items.

  Analyze the following meeting transcript and provide a concise summary, followed by a list of action items.

  Transcript: {{{transcript}}}

  Summary:
  Action Items:`, // Added transcript to the prompt.
});

const meetingSummaryFlow = ai.defineFlow(
  {
    name: 'meetingSummaryFlow',
    inputSchema: MeetingSummaryInputSchema,
    outputSchema: MeetingSummaryOutputSchema,
  },
  async input => {
    // Convert audio to text using a transcription service or model
    const audioBuffer = Buffer.from(
      input.audioDataUri.substring(input.audioDataUri.indexOf(',') + 1),
      'base64'
    );

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: "Please transcribe the following audio",
    });

    let transcript = "";
    if (media?.url) {
        transcript = media.url;
    } else {
        transcript = "Error: Could not process audio";
    }
    
    const {output} = await meetingSummaryPrompt({
      ...input,
      transcript,
    });
    return output!;
  }
);
