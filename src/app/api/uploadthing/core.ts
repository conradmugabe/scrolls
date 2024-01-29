import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import { pinecone } from "@/utils/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user || !user.id) throw new Error("UNAUTHORIZED");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const url = `https://uploadthing-prod.s3.amazonaws.com/${file.key}`;
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(`https://utfs.io/f/${file.key}`);
        const blob = await response.blob();

        const pdfLoader = new PDFLoader(blob);
        console.log(`[LOCAL]: pdf loader reached`);
        const pageLevelDocs = await pdfLoader.load();
        console.log(`[LOCAL]: page level docs reached`);
        const numberOfPages = pageLevelDocs.length;

        console.log(`Loaded ${numberOfPages} pages`);

        // const pinecone = await getPineconeClient();
        const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME!);

        console.log(`Created pinecone index`);

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        console.log(`Created embeddings`);

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        console.log(`Indexed ${numberOfPages} pages`);

        await db.file.update({
          data: { uploadStatus: "SUCCESS" },
          where: { id: createdFile.id },
        });
        console.log(`Updated file status`);
      } catch (error) {
        console.log("Something went wrong");

        console.error(error);

        await db.file.update({
          data: { uploadStatus: "FAILED" },
          where: { id: createdFile.id },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
