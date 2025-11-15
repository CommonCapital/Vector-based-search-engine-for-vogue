import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { OpenAI } from 'openai'
import { AutoProcessor, AutoTokenizer, CLIPVisionModelWithProjection, CLIPTextModelWithProjection, RawImage } from '@xenova/transformers';

 const tokenizerPromise = AutoTokenizer.from_pretrained('Xenova/clip-vit-base-patch16');
const textModelPromise = CLIPTextModelWithProjection.from_pretrained('Xenova/clip-vit-base-patch16');
export async function textEmbeddingGenerator(text: any){
    const tokenizer = await tokenizerPromise;
    const textModel = await textModelPromise;

    const textInputs = tokenizer([text], { padding: true, truncation: true });
    const { text_embeds } = await textModel(textInputs);

    return text_embeds.data
}

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
   const embedding = await textEmbeddingGenerator(query);

 console.log("Embeddings Generated:",embedding)

    // ✅ Get your Pinecone index
    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    // ✅ Query Pinecone directly
    const searchResult = await index.query({
      vector: Array.from(embedding),
      topK: 5, // return top 10 similar images
      includeMetadata: true,
    });

    // ✅ Remove duplicate results (optional)

    
   {/**  const results = searchResult.matches.filter(
      (match, index, self) =>
        index === self.findIndex((m) => m.id === match.id)
    );*/}

console.log("Search Result:", searchResult);
const result = searchResult.matches.map((result) => result.metadata);
console.log("Final result:", result);
    return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}