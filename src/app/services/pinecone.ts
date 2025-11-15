import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey: process.env.DATABASE_API_KEY!
});

export async function createIndex(indexName: string) {
  try {
 
 await pinecone.createIndex({
  name: "vogue-articles",
  dimension: 512,
  metric: "cosine",
  spec: {
    serverless: {
      cloud: "aws",
      region: "us-east-1"
    }
  },
  waitUntilReady: true,
  suppressConflicts: true
});
    console.log(`Index ${indexName} created successfully.`);
  } catch (error) {
    console.error("Error creating index:", error);
    throw error;
  }
}


export async function IndexWithVector(indexName: string): Promise<boolean | undefined> { try { const targetIndex = pinecone.Index(indexName); const stats = await targetIndex.describeIndexStats(); return (stats.totalRecordCount && stats.totalRecordCount > 0) ? true : false } catch (error) { console.error("Error checking Pinecone Index"); return false } }