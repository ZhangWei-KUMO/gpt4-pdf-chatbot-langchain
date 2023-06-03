import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OPENAI_API_KEY,PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

/* Name of directory to retrieve your files from 
   Make sure to add your PDF files inside the 'docs' folder
*/
const filePath = 'docs';
export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
    });
   
    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();
    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2500,
      chunkOverlap: 10,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('creating vector store...',docs);
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings({openAIApiKey:OPENAI_API_KEY})
    console.log(embeddings);

    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name
    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });
    // await PineconeStore.fromDocuments(docs, embeddings, {pineconeIndex: index});
      
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
