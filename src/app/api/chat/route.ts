import { env } from "@/env.mjs";
import fireworks from "@/lib/fireworks";
import { getPineconeClient } from "@/lib/pinecone";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PineconeStore } from "@langchain/pinecone";
import { getServerSession } from "next-auth";

import { ChatCompletionMessageParam } from 'openai/resources/chat';

function formatMessages(messages: any[], systemContent: string): ChatCompletionMessageParam[] {
  const formattedMessages: ChatCompletionMessageParam[] = [];

  for (let i = 0; i < messages.length; i++) {
    if (i === 0) {
      formattedMessages.push({
        role: "user",
        content: `${systemContent}\n\nUser: ${messages[i].content}`
      });
    } else {
      formattedMessages.push({
        role: messages[i].role === "user" ? "user" : "assistant",
        content: messages[i].content
      });
    }
  }

  return formattedMessages;
}

export async function POST(req: Request, res: Response) {
  const { messages, docId, isRAGMode } = await req.json();

  if (typeof docId !== "string")
    return new Response("Not found", { status: 404 });

  const session = await getServerSession(authOptions);
  if (!session) return new Response("Not found", { status: 404 });

  const doc = await prisma.document.findFirst({
    where: {
      id: docId,
      OR: [
        { ownerId: session?.user.id },
        {
          collaborators: {
            some: {
              userId: session?.user.id,
            },
          },
        },
      ],
    },
  });

  if (!doc) return new Response("Not found", { status: 404 });

  let systemContent = '';
  let vectorStore;

  if (isRAGMode) {
    if (!doc?.isVectorised) {
      throw new Error("Document not vectorised.");
    }

    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: env.HUGGINGFACE_API_KEY,
    });

    const pinecone = getPineconeClient();
    const pineconeIndex = (await pinecone).Index("docxpert");

    vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      filter: {
        fileId: docId as string,
      },
    });

    const lastMessage = messages.at(-1).content;
    const results = await vectorStore.similaritySearch(lastMessage, 6);

    systemContent = `You are an AI assistant specifically trained on the content of a provided document.
    Your knowledge is strictly limited to the information contained in this document.
    You must only answer questions based on the following context from the document:
    START CONTEXT BLOCK
    ${results.map((r) => r.pageContent).join("\n\n")}
    END OF CONTEXT BLOCK
    If the context does not provide a clear answer to the question, state that you don't have enough information from the document to answer accurately.
    Do not use any external knowledge or make assumptions beyond what is explicitly stated in the context.
    Always provide answers in Markdown format with clear headings and lists where appropriate.`;
  } else {
    systemContent = `You are a general knowledge AI assistant.
    You have broad knowledge on various topics and can engage in general conversation.
    Always provide answers in Markdown format with clear headings and lists where appropriate.`;
  }

  const formattedMessages = formatMessages(messages, systemContent);

  const response = await fireworks.chat.completions.create({
    model: "accounts/fireworks/models/mixtral-8x7b-instruct",
    temperature: isRAGMode ? 0 : 0.7,
    stream: true,
    max_tokens: 4096,
    messages: formattedMessages,
  });

  const stream = OpenAIStream(response, {
    onStart: async () => {
      await prisma.message.create({
        data: {
          text: messages.at(-1).content,
          isUserMessage: true,
          documentId: docId,
          userId: session?.user.id,
        },
      });
    },
    onCompletion: async (completion: string) => {
      await prisma.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          documentId: docId,
        },
      });
    },
  });
  return new StreamingTextResponse(stream);
}
