// Summarizes a news article from a given URL into a concise, step-by-step summary.
// - summarizeArticle - A function that takes a URL and returns a summary of the article.
// - SummarizeArticleInput - The input type for the summarizeArticle function.
// - SummarizeArticleOutput - The return type for the summarizeArticle function.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  url: z.string().url().describe('The URL of the article to summarize.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A concise, step-by-step summary of the article.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const summarizeArticlePrompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {
    schema: z.object({
      url: z.string().url().describe('The URL of the article to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise, step-by-step summary of the article.'),
    }),
  },
  prompt: `You are an expert news summarizer. Summarize the news article at the given URL in a concise, step-by-step format.

URL: {{{url}}}

Summary:`,
});

const summarizeArticleFlow = ai.defineFlow<
  typeof SummarizeArticleInputSchema,
  typeof SummarizeArticleOutputSchema
>({
  name: 'summarizeArticleFlow',
  inputSchema: SummarizeArticleInputSchema,
  outputSchema: SummarizeArticleOutputSchema,
}, async input => {
  const {output} = await summarizeArticlePrompt(input);
  return output!;
});
