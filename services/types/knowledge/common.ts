export interface KnowledgeItem {
  id: string
  title: string
  content: string
  description?: string
  category: string
  tags: string[]
  metadata: Record<string, unknown>
  source?: string
  relevanceScore?: number
  embedding?: number[]
  createdAt: Date
  updatedAt: Date
}

export interface KnowledgeQuery {
  text: string
  categories?: string[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  maxResults?: number
  similarityThreshold?: number
}

export interface KnowledgeSearchResult {
  query: string
  results: KnowledgeItem[]
  totalFound: number
  searchTime: number
  context: string
  metadata: {
    embeddingModel: string
    similarityThreshold: number
    maxResults: number
  }
}

export interface KnowledgeMetadata {
  version?: string
  author?: string
  lastModified?: Date
  [key: string]: unknown
}

export interface VectorStorage {
  add(id: string, vector: number[]): Promise<void>
  remove(id: string): Promise<void>
  update(id: string, vector: number[]): Promise<void>
  get(id: string): Promise<number[] | undefined>
  search(
    queryVector: number[],
    maxResults: number,
    threshold: number
  ): Promise<Array<{ id: string; similarity: number }>>
}

export interface RAGConfig {
  embeddingDimension?: number
  similarityThreshold?: number
  maxResults?: number
  enableCache?: boolean
  enablePersistence?: boolean
  updateInterval?: number
  batchSize?: number
}

export interface EmbeddingModel {
  name: string
  embed(text: string): Promise<number[]>
}

export interface KnowledgeIndex {
  add(id: string, vector: number[]): Promise<void>
  remove(id: string): Promise<void>
  update(id: string, vector: number[]): Promise<void>
  clear(): Promise<void>
  search(queryVector: number[], maxResults: number): Promise<string[]>
}

export interface KnowledgeStats {
  totalItems: number
  totalCategories: number
  totalTags: number
  averageEmbeddingCache: boolean
  memoryUsage: number
  categoryDistribution: Record<string, number>
  tagDistribution: Record<string, number>
  timeDistribution: Record<string, number>
  lastUpdated: Date
}
