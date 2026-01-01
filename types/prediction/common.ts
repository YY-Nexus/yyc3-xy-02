/**
 * @file 预测系统通用类型定义
 * @description 定义预测结果、质量指标、偏见报告等核心类型
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-29
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

export interface PredictionResult {
  id: string
  modelId: string
  prediction: number | number[]
  confidence: number
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface QualityMetrics {
  timestamp?: number
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  rmse: number
  mae: number
  r2Score: number
  customMetrics?: Record<string, unknown>
}

export interface BiasReport {
  overall: 'low' | 'medium' | 'high'
  metrics: {
    demographicParity: number
    disparateImpact: number
    equalOpportunity: number
  }
  recommendations: string[]
  affectedGroups: string[]
  mitigation: string[]
}

export interface CalibrationResult {
  originalMetrics: {
    avgConfidence: number
    confidenceVariance: number
    calibrationError: number
    overconfidentRatio: number
  }
  calibratedMetrics: {
    avgConfidence: number
    confidenceVariance: number
    calibrationError: number
    overconfidentRatio: number
  }
  reliabilityDiagram: Array<{
    confidence: number
    empiricalAccuracy: number
    count: number
  }>
  calibrationCurve: Array<{
    predicted: number
    actual: number
    count: number
  }>
  improvement: number
  recommendedMethod: string
}

export interface SensitiveData {
  groups?: Record<string, number[]>
  attributes?: Record<string, string[]>
}

export interface PredictionData {
  id: string
  value: number | number[]
  timestamp: number
  features?: Record<string, unknown>
  data?: Array<{
    value: number | number[]
    timestamp: number
    features?: Record<string, unknown>
  }>
  dataType?: 'timeseries' | 'cross_sectional' | 'stream'
  frequency?: string
  featuresList?: string[]
}

export interface PredictionConfig {
  modelId?: string
  confidenceThreshold?: number
  enableEnsemble?: boolean
  enableQualityMonitor?: boolean
  enableBiasDetection?: boolean
  enableCalibration?: boolean
  maxHistorySize?: number
  name?: string
  priority?: 'low' | 'medium' | 'high'
  constraints?: {
    maxModels?: number
    maxLatency?: number
    minAccuracy?: number
    allowedModels?: string[]
  }
  requirements?: {
    minAccuracy?: number
    maxLatency?: number
    maxMemoryUsage?: number
  }
  parameters?: Record<string, unknown>
  preprocessing?: {
    normalize?: boolean
    handleMissing?: boolean
    featureSelection?: string[]
  }
  validation?: {
    method?: 'cross_validation' | 'holdout' | 'bootstrap'
    folds?: number
    testSize?: number
  }
}

export interface PredictionTask {
  id: string
  name?: string
  type: 'regression' | 'classification' | 'timeseries' | 'anomaly_detection'
  description?: string
  data?: PredictionData[]
  config?: PredictionConfig
  priority?: 'low' | 'medium' | 'high'
  metadata?: Record<string, unknown>
  constraints?: ModelConstraints
  requirements?: {
    minAccuracy?: number
    maxLatency?: number
    maxMemoryUsage?: number
  }
}

export interface PredictionInsights {
  taskId: string
  accuracy: number
  confidence: number
  recommendations: string[]
  anomalies?: Array<{
    id: string
    value: number
    severity: 'low' | 'medium' | 'high'
    description: string
  }>
  trends?: Array<{
    metric: string
    direction: 'increasing' | 'decreasing' | 'stable'
    value: number
  }>
  summary?: string
  keyPoints?: KeyInsight[]
  performanceMetrics?: PredictionPerformanceMetrics
  driftAlerts?: DriftAlert[]
  riskAssessment?: RiskAssessment
}

export interface StreamingPrediction {
  id: string
  streamId: string
  value: number | number[]
  prediction?: number | number[]
  confidence: number
  timestamp: number
  isFinal: boolean
  processingTime?: number
  dataQuality?: {
    accuracy?: number
    completeness?: number
    consistency?: number
  }
  modelVersion?: string
}

export interface DataStream {
  id: string
  name: string
  data: Array<{
    timestamp: number
    value: number
  }>
  metadata?: Record<string, unknown>
  qualityMetrics?: {
    accuracy?: number
    completeness?: number
    consistency?: number
  }
}

export interface ModelConstraints {
  maxLatency?: number
  maxMemoryUsage?: number
  minAccuracy?: number
  allowedModels?: string[]
  maxTrainingTime?: number
  memoryLimit?: number
  accuracyThreshold?: number
  realTimeCapability?: boolean
}

export interface ModelSelection {
  modelId: string
  modelName: string
  algorithm: string
  confidence: number
  estimatedLatency: number
  estimatedAccuracy: number
  parameters?: Record<string, unknown>
  selectedModel?: {
    id: string
    name: string
    algorithm: string
  }
  alternativeModels?: Array<{
    id: string
    name: string
    algorithm: string
    score: number
  }>
}

export interface ModelInfo {
  id: string
  name: string
  algorithm: string
  type: 'regression' | 'classification' | 'timeseries' | 'anomaly_detection' | 'forecasting'
  averageTrainingTime: number
  memoryRequirement: number
  expectedAccuracy: number
  minDataPoints: number
  supportsRealTime: boolean
  complexity: number
  stability?: number
  parameters?: Record<string, unknown>
}

export interface ModelFitAssessment {
  modelId: string
  goodnessOfFit: number
  complexity: number
  trainingTime: number
  memoryUsage: number
  residuals?: number[]
  confidenceInterval?: [number, number]
  overfittingRisk: 'low' | 'medium' | 'high'
  residualAnalysis?: {
    mean: number
    variance: number
    skewness?: number
    kurtosis?: number
    heteroscedasticity?: boolean
    normalityTest?: boolean
    autocorrelation?: number
  }
  stabilityMetrics?: {
    coefficientOfVariation: number
    rollingVariance: number[]
    trendStability: number
    parameterStability?: number
    predictionStability?: number
    sensitivity?: number
  }
  biasVarianceTradeoff?: {
    bias: number
    variance: number
    totalError: number
  }
  recommendations?: string[]
}

export interface DataCharacteristics {
  dataType?: 'timeseries' | 'cross_sectional' | 'stream'
  dataSize: number
  featureCount: number
  targetVariance: number
  targetRange: number
  missingValueRate: number
  isTimeSeries: boolean
  seasonality: {
    detected: boolean
    period?: number
    strength?: number
  } | null
  trend: {
    trend: boolean
    direction?: 'increasing' | 'decreasing' | 'stable'
    strength?: number
  } | null
  noiseLevel: number
  linearity: number
  outliers: number
  dataFrequency?: string
  timeHorizon: number
}

export interface TrainingResult {
  modelId: string
  algorithm: string
  parameters: Record<string, unknown>
  trainingTime: number
  trainingScore: number
  validationScore: number
  featureImportance?: Record<string, number>
  trainingMetrics?: {
    mae?: number
    rmse?: number
    mape?: number
    r2?: number
    baseModelCount?: number
    avgTrainingTime?: number
    bestModelScore?: number
    worstModelScore?: number
  }
  timestamp: number
}

export interface PredictorConfig {
  name: string
  algorithm: string
  parameters: Record<string, unknown>
  preprocessing?: {
    normalize?: boolean
    handleMissing?: boolean
    featureSelection?: string[]
  }
  validation?: {
    method?: 'cross_validation' | 'holdout' | 'bootstrap'
    folds?: number
    testSize?: number
  }
}

export interface PerformanceHistory {
  timestamp: number
  score: number
  metrics: Record<string, number>
}

export interface DataDriftMetrics {
  detected: boolean
  driftType: string
  driftScore: number
  affectedFeatures: string[]
}

export interface UpdatedWeights {
  weights: number[]
  updatedAt: number
  method: string
}

export interface DriftDetection {
  detected: boolean
  driftType: string
  driftScore: number
  timestamp: number
}

export interface DataPoint {
  value: number | number[]
  timestamp: number
  features?: Record<string, unknown>
}

export interface SeasonalityAnalysis {
  detected: boolean
  period: number
  strength: number
}

export interface ProbabilisticForecast {
  prediction: number[]
  confidence: number[][]
  timestamp: number
}

export interface AnomalyReport {
  anomalies: Anomaly[]
  anomalyCount: number
  anomalyRate: number
  timestamp: number
}

export interface Anomaly {
  id: string
  timestamp: number
  value: number
  severity: 'low' | 'medium' | 'high'
  description: string
}

export interface AnomalyExplanation {
  anomalyId: string
  causes: string[]
  confidence: number
  relatedFeatures: string[]
}

export interface CausalGraph {
  nodes: Array<{ id: string; label: string }>
  edges: Array<{ from: string; to: string; strength: number }>
}

export interface CounterfactualResult {
  originalValue: number
  counterfactualValue: number
  intervention: Intervention
  expectedChange: number
  confidence: number
}

export interface Intervention {
  type: string
  target: string
  value: number
  description: string
}

export interface PredictionPerformanceMetrics {
  accuracy: number
  confidence: number
  stability: number
  avgLatency: number
  predictionCount: number
}

export interface DriftAlert {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
  timestamp: number
}

export interface Recommendation {
  category: string
  priority: 'low' | 'medium' | 'high'
  description: string
  expectedImpact?: string
  effort?: 'low' | 'medium' | 'high'
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high'
  factors: Array<{
    type: string
    severity: 'low' | 'medium' | 'high'
    description: string
    impact?: string
  }>
  mitigation: string[]
  monitoring: string[]
}

export interface KeyInsight {
  type: string
  description: string
  severity: 'low' | 'medium' | 'high'
  confidence?: number
  actionability?: 'immediate' | 'short_term' | 'long_term'
}

export interface BasePredictor {
  predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>
  train: (data: PredictionData) => Promise<TrainingResult>
  getModelInfo: () => ModelInfo
  modelId: string
  config: PredictorConfig
  isTrained: boolean
  trainingHistory: TrainingResult[]
}

export interface PredictorTaskInfo {
  ensemble?: BasePredictor
  predictor?: BasePredictor
  config: PredictionConfig | PredictorConfig
  data?: PredictionData
  modelSelection?: ModelSelection
  createdAt: number
  lastUpdated?: number
}

export interface TaskStatus {
  taskId: string
  modelInfo: ModelInfo
  config: PredictionConfig
  createdAt: number
  lastUpdated?: number
  predictionCount: number
}

export interface PredictionMetrics {
  confidence: number
}

export interface Alert {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
  timestamp: number
}
