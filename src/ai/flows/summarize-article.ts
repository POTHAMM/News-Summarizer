'use server';

/**
 * @fileOverview Summarizes a news article from a given URL into a concise summary, limited to 5 key points and 1000 words.
 *
 * - summarizeArticle - A function that takes a URL and returns a summary of the article.
 * - SummarizeArticleInput - The input type for the summarizeArticle function.
 * - SummarizeArticleOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  url: z.string().url().describe('The URL of the article to summarize.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article, with a maximum of 5 key points and 1000 words.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const getArticleContent = ai.defineTool({
  name: 'getArticleContent',
  description: 'Retrieves the content of an article from a given URL.',
  inputSchema: z.object({
    url: z.string().url().describe('The URL of the article to fetch.'),
  }),
  outputSchema: z.string(),
}, async input => {
  try {
    const response = await fetch(input.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    // Limit the content to 1000 words
    return text.split(/\s+/).slice(0, 1000).join(' ');
  } catch (error: any) {
    console.error("Failed to fetch article content:", error);
    return `Error fetching article: ${error.message}`;
  }
});

const summarizeArticlePrompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {
    schema: z.object({
      articleContent: z.string().describe('The content of the article to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the article, with a maximum of 5 key points and 1000 words.'),
    }),
  },
  prompt: `You are an expert news summarizer. Summarize the following news article, extracting the most important pieces of information, limited to 5 key points and 1000 words. Present the summary as a list of no more than 5 distinct points.

Article Content: {{{articleContent}}}

Summary:`,
  tools: [getArticleContent],
});

const summarizeArticleFlow = ai.defineFlow<
  typeof SummarizeArticleInputSchema,
  typeof SummarizeArticleOutputSchema
>({
  name: 'summarizeArticleFlow',
  inputSchema: SummarizeArticleInputSchema,
  outputSchema: SummarizeArticleOutputSchema,
}, async input => {
  const {url} = input;
  const articleContent = await getArticleContent({url});
  const {output} = await summarizeArticlePrompt({articleContent});
  return output!;
});
