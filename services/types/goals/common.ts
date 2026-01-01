/**
 * YYC³ 目标管理系统 - 公共类型定义
 */

export interface GoalModel {
  id: string
  title: string
  description: string
  status: 'draft' | 'created' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
  updatedAt: Date
  deadline?: Date
  assignee?: string
  tags: string[]
  category?: string
}

export interface GoalInput {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  deadline?: Date
  assignee?: string
  tags: string[]
  valueMetrics: ValueMetric[]
  dependencies?: string[]
  resources?: Resource[]
  risks?: Risk[]
  category?: string
  stakeholders?: string[]
  type?: 'okr' | 'standard'
  okrData?: OKRData
}

export interface GoalDefinition extends GoalModel {
  progress: number
  milestones: Milestone[]
  tasks: Task[]
  blockers: Blocker[]
  valueMetrics: ValueMetric[]
  dependencies: string[]
  resources: Resource[]
  risks: Risk[]
  estimatedDuration: number
  estimatedCost: number
  actualDuration?: number
  actualCost?: number
  riskAssessment?: RiskAssessment
  stakeholders?: string[]
  smartCriteria?: SmartCriteria
}

export interface GoalExecution {
  goalId: string
  startTime: Date
  endTime?: Date
  status: 'running' | 'paused' | 'completed' | 'failed'
  completedTasks: Task[]
  blockedTasks: Task[]
  blockers: Blocker[]
  progressUpdates: ProgressUpdate[]
  resourceUsage: ResourceUsage[]
  timeSpent: number
  budgetUsed: number
  achievements?: string[]
  deliverables?: Deliverable[]
  milestones?: {
    completed: string[]
    inProgress: string[]
    pending: number
  }
}

export interface GoalProgress {
  goalId: string
  checkDate: Date
  timestamp?: Date
  overallProgress: number
  milestoneProgress: MilestoneProgress[]
  taskProgress: TaskProgress[]
  resourceUtilization: ResourceUtilization
  riskStatus: RiskStatus
  blockers: Blocker[]
  recommendations: string[]
  nextMilestones: string[]
  adjustments: Adjustment[]
  completionRate?: number
  healthScore?: number
  stakeholderSatisfaction?: number
  predictedCompletion?: Date
}

export interface GoalEvaluation {
  goalId: string
  evaluationDate: Date
  overallValue: number
  roi: number
  businessImpact: BusinessImpact
  userSatisfaction: UserSatisfaction
  technicalOutcomes: TechnicalOutcomes
  financialBenefits: FinancialBenefits
  lessonsLearned: LessonsLearned
  recommendations: string[]
  nextSteps: string[]
}

export interface GoalLearning {
  goalId: string
  learningDate: Date
  completedAt: Date
  insights: Insight[]
  patterns: Pattern[]
  failures: Failure[]
  successes: Success[]
  knowledgeUpdates: KnowledgeUpdate[]
  recommendations: string[]
  actionItems: ActionItem[]
  bestPractices?: string[]
}

export interface SmartCriteria {
  isValid: boolean
  violations: string[]
  scores: {
    specific: number
    measurable: number
    achievable: number
    relevant: number
    timeBound: number
  }
  overallScore: number
}

export interface Milestone {
  id: string
  name: string
  description: string
  targetDate: Date
  completedDate?: Date
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  dependencies: string[]
  tasks: string[]
  deliverables: Deliverable[]
  progress: number
  completionCriteria?: string[]
}

export interface Task {
  id: string
  name: string
  description: string
  goalId?: string
  assignee?: string
  estimatedHours: number
  actualHours?: number
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high'
  dependencies: string[]
  dueDate?: Date
  completedDate?: Date
  tags: string[]
}

export interface Blocker {
  id: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'resource' | 'technical' | 'dependency' | 'external'
  blockedTasks: string[]
  blockedMilestones: string[]
  reportedDate: Date
  resolvedDate?: Date
  resolution?: string
  assignee?: string
}

export interface ValueMetrics {
  businessValue: number
  userValue: number
  technicalValue: number
  financialValue: number
  strategicValue: number
}

export interface ValueMetric {
  name: string
  type: 'business' | 'user' | 'technical' | 'financial' | 'strategic'
  target: number
  current?: number
  unit: string
  weight: number
}

export interface RiskAssessment {
  goalId: string
  assessmentDate: Date
  risks: Risk[]
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical'
  overallRisk?: number
  mitigationStrategies: MitigationStrategy[]
  contingencyPlans: ContingencyPlan[]
}

export interface Risk {
  id: string
  description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high' | 'critical'
  category: 'technical' | 'resource' | 'schedule' | 'scope' | 'external'
  status: 'identified' | 'mitigated' | 'active' | 'resolved'
  identifiedDate: Date
  mitigationStrategy?: string
  owner?: string
}

export interface MitigationStrategy {
  riskId: string
  strategy: string
  actions: string[]
  owner: string
  dueDate: Date
  status: 'planned' | 'in_progress' | 'completed'
}

export interface ContingencyPlan {
  triggerCondition: string
  actions: string[]
  owner: string
  estimatedCost: number
  estimatedTime: number
}

export interface Collaboration {
  goalId: string
  collaborators: Collaborator[]
  communicationChannels: CommunicationChannel[]
  sharedResources: Resource[]
  dependencies: GoalDependency[]
  meetings: Meeting[]
  documents: Document[]
}

export interface Collaborator {
  userId: string
  name: string
  role: 'owner' | 'contributor' | 'reviewer' | 'stakeholder'
  responsibilities: string[]
  joinedDate: Date
  contributionLevel: number
}

export interface CommunicationChannel {
  type: 'email' | 'chat' | 'meeting' | 'document'
  name: string
  participants: string[]
  frequency: string
  purpose: string
}

export interface GoalDependency {
  sourceGoalId: string
  targetGoalId: string
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish'
  lag?: number
}

export interface Meeting {
  id: string
  title: string
  date: Date
  participants: string[]
  agenda: string[]
  minutes?: string
  actionItems: ActionItem[]
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  author: string
  createdDate: Date
  lastModifiedDate: Date
  version: string
}

export interface LessonsLearned {
  goalId: string
  reviewDate: Date
  successes: Success[]
  failures: Failure[]
  insights: Insight[]
  recommendations: string[]
  actionItems: ActionItem[]
  knowledgeUpdates: KnowledgeUpdate[]
}

export interface Success {
  id: string
  description: string
  category: string
  impact: 'low' | 'medium' | 'high'
  contributingFactors: string[]
  replicable: boolean
}

export interface Failure {
  id: string
  description: string
  category: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  rootCauses: string[]
  lessons: string[]
  preventiveMeasures: string[]
}

export interface Insight {
  id: string
  description: string
  category: string
  evidence: string[]
  confidence: number
  applicability: string[]
}

export interface KnowledgeUpdate {
  id: string
  type: 'best_practice' | 'pattern' | 'anti_pattern' | 'lesson' | 'tool'
  title: string
  description: string
  tags: string[]
  applicableContexts: string[]
  createdDate: Date
}

export interface ActionItem {
  id: string
  description: string
  assignee: string
  dueDate: Date
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  relatedGoalId?: string
}

export interface Pattern {
  id: string
  name: string
  description: string
  occurrences: number
  confidence: number
  impact: 'positive' | 'negative' | 'neutral'
  recommendations: string[]
}

export interface ProgressUpdate {
  timestamp: Date
  milestone: string
  progress: number
  completionRate?: number
  achievements: string[]
  issues: string[]
  nextSteps: string[]
  notes?: string
  healthScore?: number
}

export interface ResourceUsage {
  resourceId: string
  resourceName: string
  type: 'human' | 'equipment' | 'budget' | 'time'
  allocated: number
  used: number
  remaining: number
  efficiency: number
}

export interface Deliverable {
  id: string
  name: string
  description: string
  type: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  quality: number
  dueDate: Date
  completedDate?: Date
  reviewer?: string
  feedback?: string
}

export interface MilestoneProgress {
  milestoneId: string
  milestoneName: string
  progress: number
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed'
  completionDate?: Date
  issues: string[]
}

export interface TaskProgress {
  taskId: string
  taskName: string
  progress: number
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  assignee?: string
  dueDate?: Date
  completedDate?: Date
}

export interface ResourceUtilization {
  overall: number
  byType: Record<string, number>
  byResource: Record<string, number>
  efficiency: number
  bottlenecks: string[]
}

export interface RiskStatus {
  overallLevel: 'low' | 'medium' | 'high' | 'critical'
  activeRisks: number
  mitigatedRisks: number
  newRisks: number
  topRisks: Risk[]
}

export interface Adjustment {
  id: string
  type: 'timeline' | 'resource' | 'scope' | 'priority' | 'strategy'
  description: string
  reason: string
  impact: string
  approvedBy: string
  approvedDate: Date
  implementationDate?: Date
  status: 'proposed' | 'approved' | 'implemented' | 'rejected'
}

export interface Resource {
  id: string
  name: string
  type: 'human' | 'equipment' | 'budget' | 'time' | 'software' | 'hardware'
  quantity: number
  unit: string
  allocated: number
  used: number
  costPerUnit: number
  totalCost: number
}

export interface BusinessImpact {
  revenue: number
  costSavings: number
  marketShare: number
  customerSatisfaction: number
  brandReputation: number
  strategicAlignment: number
}

export interface UserSatisfaction {
  overall: number
  functionality: number
  usability: number
  performance: number
  reliability: number
  support: number
}

export interface TechnicalOutcomes {
  codeQuality: number
  systemPerformance: number
  scalability: number
  security: number
  maintainability: number
  innovation: number
}

export interface FinancialBenefits {
  directRevenue: number
  costReduction: number
  efficiencyGains: number
  roi: number
  paybackPeriod: number
  netPresentValue: number
}

export interface OKRFramework {
  initialize(): Promise<void>
  createOKR(goalId: string, okrData: OKRData): Promise<void>
  deleteOKR(goalId: string): Promise<void>
}

export interface OKRData {
  objectives: Objective[]
  keyResults: KeyResult[]
  period: string
  owner: string
}

export interface Objective {
  id: string
  title: string
  description: string
  progress: number
  keyResults: string[]
}

export interface KeyResult {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  progress: number
  dueDate: Date
}

export interface GoalLifecycle {
  id: string
  goalId: string
  creation: { goal: GoalDefinition; validation: SmartCriteria }
  planning: GoalPlanning
  execution: GoalExecution
  monitoring: GoalProgress
  adjustment: GoalAdjustment
  completion: {
    goalId: string
    completionDate: Date
    finalStatus: 'completed' | 'partially_completed' | 'cancelled'
    actualDuration: number
    finalCost: number
    achievements: string[]
    deliverables: Deliverable[]
    lessons: string[]
  }
  evaluation: GoalEvaluation
  learning: GoalLearning
  startTime: Date
  endTime: Date
  status: 'in_progress' | 'completed' | 'failed'
}

export interface GoalPlanning {
  goalId: string
  milestones?: Milestone[]
  tasks: Task[]
  timeline: number
  budget: number
  resources: Resource[]
  risks: Risk[]
}

export interface GoalAdjustment {
  goalId: string
  adjustments: Adjustment[]
  reason: string
  approvedBy: string
  approvedDate: Date
}

export interface GoalCompletion {
  goalId: string
  completionDate: Date
  finalStatus: 'completed' | 'partially_completed' | 'cancelled'
  actualDuration: number
  finalCost: number
  achievements: string[]
  deliverables: Deliverable[]
  lessons: string[]
}

export interface ProgressData {
  goalId: string
  timestamp: Date
  completionRate: number
  healthScore: number
  milestonesProgress: MilestoneProgress[]
  resourceUtilization: ResourceUtilization
  riskIndicators: RiskStatus
  blockers: Blocker[]
  stakeholderSatisfaction: number
  predictedCompletion: Date
}

export interface AdjustmentNeeds {
  needsAdjustment: boolean
  adjustmentTypes?: string[]
  priority?: 'low' | 'medium' | 'high'
  reasons?: string[]
}

export interface AdjustmentSuggestion {
  type: 'timeline' | 'resource' | 'scope' | 'priority' | 'strategy'
  description: string
  reason: string
  impact: string
  estimatedCost?: number
  estimatedTime?: number
}

export interface ValueData {
  goalId: string
  businessMetrics?: Record<string, number>
  userMetrics?: Record<string, number>
  technicalMetrics?: Record<string, number>
  financialMetrics?: Record<string, number>
  strategicMetrics?: Record<string, number>
}

export interface BusinessImpactData {
  score: number
  description: string
  details?: {
    revenue?: number
    costSavings?: number
    marketShare?: number
    customerSatisfaction?: number
    strategicAlignment?: number
  }
}

export interface TechnicalOutcomesData {
  codeQuality?: number
  systemPerformance?: number
  scalability?: number
  security?: number
  maintainability?: number
  innovation?: number
  details?: Record<string, unknown>
}

export interface FinancialBenefitsData {
  directRevenue?: number
  costReduction?: number
  efficiencyGains?: number
  roi?: number
  paybackPeriod?: number
  netPresentValue?: number
}

export interface OverallValueMetrics {
  roi: number
  businessImpact: BusinessImpact
  userSatisfaction: number
  technicalOutcomes: TechnicalOutcomes
  financialBenefits: FinancialBenefits
}

export interface StakeholderFeedback {
  overall: number
  byStakeholder: Record<string, number>
  comments: string[]
  suggestions: string[]
}

export interface PatternData {
  id: string
  name: string
  description: string
  occurrences: number
  confidence: number
  impact: 'positive' | 'negative' | 'neutral'
  recommendations: string[]
}

export interface FailureData {
  id: string
  description: string
  category: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  rootCauses: string[]
  lessons: string[]
  preventiveMeasures: string[]
}

export interface InsightsData {
  patterns: PatternData[]
  failures: FailureData[]
  successes: Success[]
  recommendations: string[]
  actionItems: ActionItem[]
  bestPractices?: string[]
}

export interface KnowledgeBaseUpdate {
  id: string
  type: 'best_practice' | 'pattern' | 'anti_pattern' | 'lesson' | 'tool'
  title: string
  description: string
  goalId: string
  createdDate: Date
  tags: string[]
}
