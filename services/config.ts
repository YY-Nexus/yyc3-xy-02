// @file services/config.ts
// @description YYC³ 服务配置文件
// @author YYC³团队
// @version 1.0.0

export interface Config {
  ollama?: {
    baseUrl?: string;
    defaultModel?: string;
  };
  neo4j?: {
    uri?: string;
    user?: string;
    password?: string;
  };
  chroma?: {
    url?: string;
    collectionName?: string;
    embeddingModel?: string;
  };
  rag?: {
    maxDocuments?: number;
    similarityThreshold?: number;
    maxContextLength?: number;
    topK?: number;
  };
}

const config: Config = {
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    defaultModel: process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:8b',
  },
  neo4j: {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'password',
  },
  chroma: {
    url: process.env.CHROMA_URL || 'http://localhost:8000',
    collectionName: process.env.CHROMA_COLLECTION_NAME || 'yyc3_knowledge_base',
    embeddingModel: process.env.CHROMA_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
  },
  rag: {
    maxDocuments: parseInt(process.env.RAG_MAX_DOCUMENTS || '10', 10),
    similarityThreshold: parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.7'),
    maxContextLength: parseInt(process.env.RAG_MAX_CONTEXT_LENGTH || '4000', 10),
    topK: parseInt(process.env.RAG_TOP_K || '5', 10),
  },
};

export default config;
