import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { OpenAI } from 'openai'
export async function POST(req: Request) {
    const {query} = await req.json();
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!query) {
return NextResponse.json({error: "Query is required"}, {status: 400})
    }
    try {
        const pinecone = new Pinecone({
          apiKey: process.env.DATABASE_API_KEY!
        });
 // ✅ Use same multimodal embedding model as your images
    // so that the text and images share the same embedding space.
    const result = await client.embeddings.create({
      model: "gpt-4.1-mini", // instead of text-embedding-3-large
      input: query,
    });

    const embedding = result.data[0].embedding;

    // ✅ Get your Pinecone index
    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    // ✅ Query Pinecone directly
    const searchResult = await index.query({
      vector: embedding,
      topK: 5, // return top 10 similar images
      includeMetadata: true,
    });

    // ✅ Remove duplicate results (optional)

    
   {/**  const results = searchResult.matches.filter(
      (match, index, self) =>
        index === self.findIndex((m) => m.id === match.id)
    );*/}


    return NextResponse.json({ searchResult }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}