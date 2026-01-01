export interface AIModel {
  name: string
  capabilities: string[]
  specialization: string
}

export interface KnowledgeBaseEntry {
  fundamentals?: string[]
  innovations?: string[]
  cultural_elements?: string[]
  [key: string]: unknown
}
