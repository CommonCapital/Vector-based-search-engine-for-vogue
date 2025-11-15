


export interface MetaData {
  image_url: string;
 metadata: {
  author: string;
  date: string;
  description: string;
  id: string;
  image_url: string;
  name: string;
  source_url: string;}
}


export interface VogueMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  date: string; // YYYY-MM-DD format
  image_url: string;
  source_url: string;
}

// Each vector returned from Pinecone
export interface VogueVector {
  id: string;                  // vector id
  values: number[];            // embedding vector
  metadata: VogueMetadata;     // the metadata stored
}