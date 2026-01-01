export interface TaskResult {
  type: string
  data: unknown
  confidence: number
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface SubtaskResult {
  type: string
  data: unknown
  confidence: number
  timestamp: number
  error?: string
  metrics?: Record<string, number>
}

export interface AgentExperience {
  id: string
  taskId: string
  type: string
  outcome: 'success' | 'failure' | 'partial'
  context: Record<string, unknown>
  actions: string[]
  results: Record<string, unknown>
  lessons: string[]
  timestamp: number
}

export interface LogData {
  [key: string]: unknown
  timestamp?: number
  taskId?: string
  subtaskId?: string
  userId?: string
}
