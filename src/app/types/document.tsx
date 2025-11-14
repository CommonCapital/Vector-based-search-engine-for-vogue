export interface Document {
  pageContent: string;
  metadata: {
    id?: string;
    title: string;
    plaintiff: string;
    defendant: string;
    date: string;
    topic: string;
    outcome: string;
    pageContent: string;
    [key: string]: any;
  };
}


export interface MetaData {
  image_url: string;
 metadata: {
  id: string;
  name: string;
  description: string;
  author: string;
  date: string;
  image_url: string;
  source_url: string;}
}