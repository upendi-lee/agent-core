import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {nextjs} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    nextjs(),
    googleAI({apiKey: process.env.GEMINI_API_KEY}),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
