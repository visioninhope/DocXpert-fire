import { env } from "@/env.mjs";
import {fireworks} from "@/lib/fireworks";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  if (env.NODE_ENV === "development") {
    return new StreamingTextResponse(
      {
        // @ts-ignore
        async *[Symbol.asyncIterator]() {
          let i = 0;
          while (i < 15) {
            yield `${i}`;
            i++;
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          yield `done, time: ${new Date().toISOString()}`;
        },
      },
      {
        headers: {
          "Content-Type": "text/plain",
        },
      },
    );
  } else {
    const { prompt, isRAGMode } = await req.json();

    const systemMessage = isRAGMode
      ? "You are an AI writing assistant that continues existing text based on context from prior text and specific document knowledge. " +
        "Give more weight/priority to the later characters than the beginning ones. " +
        "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
        "Only return the text that you generate, not the prompt."
      : "You are an AI writing assistant that continues existing text based on general knowledge. " +
        "Give more weight/priority to the later characters than the beginning ones. " +
        "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
        "Only return the text that you generate, not the prompt.";

    const response = await fireworks.chat.completions.create({
      model: "accounts/fireworks/models/mixtral-8x7b-instruct",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  }
}
