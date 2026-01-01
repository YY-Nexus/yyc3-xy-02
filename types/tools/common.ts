/**
 * YYC³ 智能预测系统 - 工具类型定义
 */

/**
 * 工具状态枚举
 */
export enum ToolStatus {
  REGISTERED = 'registered',
  READY = 'ready',
  BUSY = 'busy',
  ERROR = 'error',
  DISABLED = 'disabled',
  UNREGISTERED = 'unregistered',
  STOPPED = 'stopped'
}

/**
 * 工具能力定义
 */
export interface ToolCapability {
  name: string
  description: string
  parameters: ToolParameter[]
  returnType: string
}

/**
 * 工具参数定义
 */
export interface ToolParameter {
  name: string
  type: string
  required: boolean
  description: string
  enum?: string[]
  defaultValue?: unknown
}

/**
 * 工具定义
 */
export interface ToolDefinition {
  name: string
  displayName: string
  description: string
  version: string
  category: string
  tags?: string[]
  entryPoint: string
  capabilities: ToolCapability[]
  status: ToolStatus
  registeredAt?: Date
  updatedAt?: Date
  dependencies?: string[]
  metadata?: Record<string, unknown>
  timeout?: number
}

/**
 * 工具上下文
 */
export interface ToolContext {
  userId?: string
  sessionId?: string
  timestamp: Date
  metadata?: Record<string, unknown>
  toolName?: string
  parameters?: Record<string, unknown>
  executionId?: string
}

/**
 * 工具执行请求
 */
export interface ToolExecutionRequest {
  toolName: string
  capability: string
  parameters: Record<string, unknown>
  context?: ToolContext
  timeout?: number
  userId?: string
  sessionId?: string
  metadata?: Record<string, unknown>
}

/**
 * 工具执行结果
 */
export interface ToolExecutionResult {
  success: boolean
  data?: unknown
  error?: string
  executionTime: number
  timestamp: Date
  metadata?: Record<string, unknown>
}

/**
 * 工具指标
 */
export interface ToolMetrics {
  executionCount: number
  successCount: number
  errorCount: number
  averageExecutionTime: number
  lastExecutedAt: Date | null
  lastStatus: ToolStatus
  qualityScore: number
}

/**
 * 工具注册表配置
 */
export interface ToolRegistryConfig {
  maxConcurrentExecutions?: number
  healthCheckInterval?: number
  metricsRetentionDays?: number
  enableSemanticSearch?: boolean
  enableAutoOptimization?: boolean
  enableDependencyResolution?: boolean
}

/**
 * 编排步骤
 */
export interface OrchestrationStep {
  id: string
  toolName: string
  capability: string
  parameters: Record<string, unknown>
  dependencies: string[]
  priority: number
  timeout?: number
  estimatedDuration?: number
  retryPolicy?: {
    maxRetries: number
    retryDelay: number
    backoffMultiplier: number
  }
}

/**
 * 工具编排请求
 */
export interface ToolOrchestrationRequest {
  goal: string
  context?: Record<string, unknown>
  constraints?: {
    maxTools?: number
    timeout?: number
    budget?: number
  }
  preferences?: {
    preferredTools?: string[]
    avoidTools?: string[]
    priority?: 'speed' | 'quality' | 'cost'
  }
  requiredCapabilities?: string[]
}

/**
 * 工具编排计划
 */
export interface ToolOrchestrationPlan {
  id: string
  goal: string
  steps: OrchestrationStep[]
  estimatedDuration: number
  estimatedCost: number
  createdAt: Date
  metadata?: Record<string, unknown>
  requiredTools?: string[]
  dependencies?: string[]
}

/**
 * 编排执行状态
 */
export interface OrchestrationExecutionStatus {
  planId: string
  userId?: string
  completedSteps: string[]
  failedSteps: Array<{ stepId: string; error: string }>
  startTime: Date
  endTime?: Date
  progress: number
  results: Map<string, unknown>
  errors: string[]
}
