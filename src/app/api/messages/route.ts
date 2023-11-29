import { NextRequest, NextResponse } from "next/server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { db } from "@/db";
import { pinecone } from "@/utils/pinecone";
import { openai } from "@/utils/openai";

const schema = z.object({
  fileId: z.string(),
  message: z.string(),
});

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id)
    return NextResponse.json("UNAUTHORIZED", { status: 401 });

  const body = await request.json();
  const parsedBody = schema.safeParse(body);
  if (!parsedBody.success)
    return NextResponse.json(parsedBody.error.format(), { status: 400 });

  const { fileId, message } = parsedBody.data;

  const file = await db.file.findUnique({
    where: { id: fileId, userId: user.id },
  });
  if (!file) return NextResponse.json("NOT_FOUND", { status: 404 });

  await db.message.create({
    data: {
      isUserMessage: true,
      text: message,
      fileId,
      userId: user.id,
    },
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME!);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessage = await db.message.findMany({
    where: { fileId },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  const formattedMessages = prevMessage.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId: user.id,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
}
