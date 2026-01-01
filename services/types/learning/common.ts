/**
 * YYC³ 智能预测系统 - 学习系统通用类型定义
 */

export type LearningLevel = 'behavioral' | 'strategic' | 'knowledge'

export interface LearningConfig {
  levels?: LearningLevel[]
  adaptationRate?: number
  experienceBufferSize?: number
  learningRate?: number
  explorationRate?: number
  transferThreshold?: number
  curriculumStages?: number
  ensembleSize?: number
  updateFrequency?: number
  persistLearning?: boolean
  enableTransfer?: boolean
  enableCurriculum?: boolean
  enableEnsemble?: boolean
}

export interface LearningExperience {
  id: string
  taskType: string
  context: Record<string, unknown>
  action: string
  outcome: unknown
  timestamp: Date
  processed: boolean
  reward?: number
  metadata?: Record<string, unknown>
}

export interface LearningStrategy {
  id: string
  taskType: string
  name: string
  description: string
  parameters: Record<string, unknown>
  performance: number
  confidence: number
  createdAt: Date
  lastUsed?: Date
  optimized?: boolean
}

export interface MetaLearner {
  id: string
  level: LearningLevel
  strategies: LearningStrategy[]
  performance: number
  adaptationRate: number
  lastUpdate: Date
}

export interface LearningMetrics {
  totalExperiences: number
  strategiesLearned: number
  adaptationsPerformed: number
  transferLearningSuccess: number
  averageLearningRate: number
  knowledgeGraphNodes: number
  knowledgeGraphEdges: number
  lastUpdated: Date
  performanceMetrics: Map<string, number>
  learningEfficiency: number
}

export interface KnowledgeGraphNode {
  id: string
  type: string
  data: Record<string, unknown>
  connections: string[]
}

export interface KnowledgeGraphEdge {
  id: string
  from: string
  to: string
  weight: number
  type: string
  data: Record<string, unknown>
}

export class KnowledgeGraph {
  nodes: Map<string, unknown> = new Map()
  edges: Map<string, unknown> = new Map()

  addNode(id: string, node: unknown): void {
    this.nodes.set(id, node)
  }

  addEdge(from: string, to: string, edge: unknown): void {
    const edgeId = `${from}-${to}`
    this.edges.set(edgeId, edge)
  }

  getRelatedNodes(id: string): unknown[] {
    return Array.from(this.nodes.values())
  }

  findPath(from: string, to: string): unknown[] {
    return []
  }
}

export interface ExperienceReplay {
  experiences: LearningExperience[]
  bufferSize: number
  currentSize: number
  lastUpdated: Date
  priorityScores: Map<string, number>
}

export interface AdaptationStrategy {
  id: string
  needs: string[]
  actions: AdaptationAction[]
  priority: 'low' | 'medium' | 'high'
  estimatedImpact: number
  createdAt?: Date
}

export interface AdaptationAction {
  type: string
  parameters: Record<string, unknown>
  expectedOutcome: string
}

export interface LearningFeedback {
  taskId: string
  action: string
  outcome: unknown
  timestamp: Date
  immediateReward: number
  longTermValue: number
  analysis: unknown
  improvements: string[]
  confidence: number
  recommendations: string[]
}

export interface ModelEnsemble {
  id: string
  models: ModelInfo[]
  strategy: string
  weights: number[]
  performance: EnsemblePerformance
  diversity: unknown
  taskType: string
  createdAt: Date
  lastUpdated: Date
}

export interface ModelInfo {
  id: string
  type: string
  performance: number
}

export interface EnsemblePerformance {
  accuracy: number
  improvement: number
  confidence: number
}

export interface TransferLearning {
  id: string
  sourceDomain: string
  targetDomain: string
  domainSimilarity: DomainSimilarity
  transferableKnowledge: unknown
  transferredKnowledge: unknown
  validationResults: TransferValidation
  success: boolean
  improvementRate: number
  timestamp: Date
}

export interface DomainSimilarity {
  score: number
  sharedFeatures: string[]
}

export interface TransferValidation {
  successRate: number
  improvementRate: number
  confidence: number
}

export interface CurriculumLearning {
  id: string
  objectives: string[]
  sequence: CurriculumStage[]
  progress: Record<string, number>
  evaluation: CurriculumEvaluation
  completionTime: number
  success: boolean
}

export interface CurriculumStage {
  level: number
  objective: string
  requiredMastery: number
  materials: unknown
}

export interface CurriculumEvaluation {
  overallMastery: number
  stageMastery: number[]
  timeEfficiency: number
}

export interface PatternAnalysis {
  patterns: Pattern[]
  confidence: number
  frequency: number
}

export interface Pattern {
  id: string
  type: string
  features: Record<string, unknown>
  occurrences: number
  successRate: number
}

export interface StrategyCandidate {
  id: string
  name: string
  description: string
  parameters: Record<string, unknown>
  expectedPerformance: number
  confidence: number
}

export interface StrategyEvaluation {
  strategyId: string
  score: number
  metrics: Record<string, number>
  strengths: string[]
  weaknesses: string[]
}

export interface EnvironmentAnalysis {
  features: string[]
  complexity: 'low' | 'medium' | 'high'
  stability: number
  predictability: number
}

export interface EnvironmentDifference {
  score: number
  differences: EnvironmentChange[]
  severity: 'low' | 'medium' | 'high'
}

export interface EnvironmentChange {
  parameter: string
  oldValue: unknown
  newValue: unknown
  impact: number
}

export interface TransferableKnowledge {
  id: string
  type: string
  content: unknown
  confidence: number
  applicability: string[]
}

export interface TransferredKnowledge {
  original: TransferableKnowledge
  adapted: unknown
  adaptation: 'none' | 'light' | 'heavy'
  confidence: number
}

export interface LearningStageResult {
  stageId: string
  success: boolean
  performance: number
  timeSpent: number
  errors: number
}

export interface StageEvaluation {
  mastery: number
  improvement: number
  feedback: string[]
  nextAction: 'continue' | 'repeat' | 'skip'
}

export interface ModelDiversity {
  score: number
  diversityMetrics: Record<string, number>
  complementaryStrengths: string[]
}

export interface EnsembleModel {
  id: string
  models: ModelInfo[]
  strategy: string
  weights: number[]
  performance: EnsemblePerformance
}

export interface ActionOutcomeAnalysis {
  success: boolean
  efficiency: number
  quality: number
  errors: string[]
  improvements: string[]
}

export interface LearningRecommendation {
  action: string
  priority: number
  expectedBenefit: number
  confidence: number
}
