'use server'

import { NextResponse } from "next/server";
import { createIndex, IndexWithVector } from "./pinecone";
 import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {promises as fs} from 'fs';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import path from "path";

import { Document, MetaData } from "../types/document";
import { metaData } from "@/lib/data";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const batchUpsert = async ( index: any, vectors: any, batchSize: number = 50) => {
  for (let i = 0; i <vectors.length; i += batchSize) {
const batch = vectors.slice(i, i + batchSize);
console.log("Upserting batch");
await index.upsert(batch)
  }
}
{/**
  const readMetadata = async (): Promise<Document['metadata'][] | undefined> => {
  try {
    const filePath = path.resolve(process.cwd(), "docs/db.json");
    const data = await fs.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData.documents || [];
  } catch (error) {
    console.error("Error reading metadata:", error)
  }
} */}

{/** const flattenMetadata = (metadata: any): Document["metadata"] => {
  const flatMetadata = {...metadata};
  if (flatMetadata.pdf) {
    if (flatMetadata.pdf.pageCount) {
      flatMetadata.totalPages = flatMetadata.pdf.pageCount
    }
    delete flatMetadata.pdf;
  }
  return flatMetadata;
};*/}

export const initiateBootstrap = async (targetIndex: string) => {
 const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
 const response = await fetch(`${baseURL}/api/ingest`, {
    method: 'POST',
    headers: {
        'Content-Type': "application/json",
    },
    body: JSON.stringify({
        targetIndex
    })
 });
 if (!response.ok) {
    throw new Error("Failed to initiate bootstrap process" + response.statusText);
 }
}

{/** 
  const isValidDocument = (content: string): boolean => {
if (!content || typeof content !== "string") return false;
const trimmed = content.trim();
return trimmed.length > 0 && trimmed.length < 8192;
}
  */}

export const handleBootSrap = async (targetIndex: string) => {
    try {
        console.log("Running bootstrap process for targetIndex:", targetIndex);

        // Create Index if it doesn't exist
        await createIndex(targetIndex)
        const hasVectors = await IndexWithVector(targetIndex);
        if (hasVectors) {
            console.log("Index has vectors");
            return NextResponse.json({success: true}, {status: 200});
        };
{/** console.log("Loading the document and metadata...");
          const docsPath = path.resolve(process.cwd(), "docs")
          const loader = new DirectoryLoader(docsPath, {
            '.pdf': (filePath: string) => new PDFLoader(filePath)
          })

          const documents = await loader.load();
          if (documents.length === 0) {
            console.warn("No PDF documents found in docs directory");
            return NextResponse.json({error: "No PDF documents found"}, {status: 400});
          }
          const metadata = await readMetadata();
          const validDocuments = documents.filter((doc) => {
isValidDocument(doc.pageContent)
          })

          validDocuments.forEach((doc) => {
            const fileMetadata = metadata?.find(
              (meta) => meta.filename === path.basename(doc.metadata.source) 
            );
            if (fileMetadata) {
              doc.metadata = {
                ...doc.metadata,
                ...fileMetadata,
                pageContent: doc.pageContent
              }
            }
               console.log(`Found ${validDocuments.length} valid documents`);
            */}
         
          
        {/**
           const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
          });
          const splits = await splitter.splitDocuments(validDocuments);
          console.log(`Created ${splits.length} chunks`);
          
          
         const BATCH_SIZE= 5;
         for (let i = 0; i < splits.length; i += BATCH_SIZE) {
          const batch = splits.slice(i, i + BATCH_SIZE);
          console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(splits.length / BATCH_SIZE)}`)
         
        const validBatch = batch.filter((split) => {
          isValidContent(split.pageContent)
         });
         if (validBatch.length === 0) {
          console.log("Skipping batch with no valid content");
          continue;
         }

         const castedBatch: Document[] = validBatch.map((split) => ({
          pageContent: split.pageContent.trim(),
          metadata: {
            ...flattenMetadata(split.metadata as Document["metadata"]),
            id: uuidv4(),
            pageContent: split.pageContent.trim(),
          },
         }));
        }

          */}
         
         //Prepare Data
         const Data: MetaData[] = metaData.map((meta) => ({
  image_url: meta.image_url,
  metadata: {
    id: meta.metadata.id,
    name: meta.metadata.name,
    description: meta.metadata.description,
    author: meta.metadata.author,
    date: meta.metadata.date,
    image_url: meta.metadata.image_url,
    source_url: meta.metadata.source_url,
  },
}));
//Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.DATABASE_API_KEY!
});
//Prepare Index
const index = pinecone.Index(targetIndex);

{/** const idsToFetch: string[] = Data
  .map(d => d.metadata.id)
  .filter((id): id is string => !!id); // type guard ensures ids are strings
// Get only IDs that exist in Pinecone
const existingVectorsResponse = await index.fetch(idsToFetch);

// Cast response to any to bypass TS error
const existingVectorIds = new Set(Object.keys((existingVectorsResponse as any).vectors ?? {}));

// Filter out data that already exists
const newData = Data.filter(d => d.metadata.id && !existingVectorIds.has(d.metadata.id));
if (newData.length === 0) {
  console.log("No new vectors to upsert, skipping embeddings.");
  return;
}*/}
// Fetch existing vectors

try {

  
  //Create embeddings with vectors
 const result = await client.embeddings.create({
  model: "gpt-4.1-mini", // image embedding model
  input: Data.map((metaData) => metaData.image_url),
  
});
//Prepare Vectors
const vectors = result.data.map((item, index) => ({
  id: Data[index].metadata.id!,
  name: Data[index].metadata.name,
  image_url: Data[index].image_url,
  embedding: item.embedding, // number[]
}));

console.log(vectors);



//Upsert Vectors to Pinecone
await batchUpsert(index, vectors, 50);

await new Promise((resolve) => setTimeout(resolve, 1000));



} catch (error) {
  console.error("Error creating embeddings", error)
  return NextResponse.json({error: "Error creating embeddings"}, {status: 400});
}
    } catch (error) {
        console.error("Error bootstrapping:", error);
        return NextResponse.json({error: "Error bootstrapping"}, {status: 500})
    }
}