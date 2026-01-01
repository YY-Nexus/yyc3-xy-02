export interface MultimodalContent {
  id: string
  type: string
  content: unknown
  metadata: Record<string, unknown>
}

export type AnyObject = Record<string, unknown>
