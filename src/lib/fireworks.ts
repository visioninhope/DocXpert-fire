import { env } from "@/env.mjs";
import OpenAI from "openai";

const fireworks = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY,
  baseURL: "https://api.fireworks.ai/inference/v1",
});

export { fireworks };

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export { openai };

export async function generateSubheadings(topic: string): Promise<string[]> {
  const response = await fireworks.chat.completions.create({
    model: "accounts/fireworks/models/mixtral-8x7b-instruct",
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that generates subheadings for articles.",
      },
      {
        role: "user",
        content: `Generate 5 subheadings for an article about: ${topic}`,
      },
    ],
    max_tokens: 200,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return [];
  }

  const subheadings = content
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.replace(/^\d+\.\s*/, '').trim());

  return subheadings;
}

export async function generateArticle(topic: string, subheadings: string[]): Promise<string> {
  const response = await fireworks.chat.completions.create({
    model: "accounts/fireworks/models/mixtral-8x7b-instruct",
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that generates full-length articles.",
      },
      {
        role: "user",
        content: `Generate a full-length article about "${topic}" using these subheadings:\n${subheadings.join('\n')}`,
      },
    ],
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content ?? '';
}
