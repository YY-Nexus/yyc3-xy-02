/**
 * YYC³ 智能预测系统 - 动态模型选择器
 * 根据数据特征和任务需求智能选择最适合的模型
 */

import type {
  PredictionData,
  PredictionTask,
  ModelConstraints,
  ModelSelection,
  ModelFitAssessment,
  ModelInfo,
  DataCharacteristics
} from '@/types/prediction/common'

/**
 * 动态模型选择器
 */
export class DynamicModelSelector {
  private modelRegistry: Map<string, ModelInfo> = new Map()
  private selectionHistory: ModelSelection[] = []

  constructor() {
    this.initializeModelRegistry()
  }

  /**
   * 选择最优模型
   */
  async selectOptimalModel(
    data: PredictionData,
    task: PredictionTask,
    constraints: ModelConstraints
  ): Promise<ModelSelection> {
    const dataCharacteristics = this.analyzeDataCharacteristics(data)

    const candidateModels = this.getCandidateModels(task.type, dataCharacteristics, constraints)

    const modelAssessments: ModelFitAssessment[] = []
    for (const modelId of candidateModels) {
      try {
        const assessment = await this.evaluateModelFit(modelId, data)
        modelAssessments.push(assessment)
      } catch (error) {
        console.warn(`模型评估失败: ${modelId}`, error)
      }
    }

    const bestModel = this.selectBestModel(modelAssessments, task, constraints)

    const modelInfo = this.modelRegistry.get(bestModel.modelId)

    const selection: ModelSelection = {
      modelId: bestModel.modelId,
      modelName: modelInfo?.name || bestModel.modelId,
      algorithm: modelInfo?.algorithm || 'unknown',
      confidence: this.calculateSelectionConfidence(bestModel),
      estimatedLatency: modelInfo?.averageTrainingTime || 0,
      estimatedAccuracy: bestModel.goodnessOfFit,
      selectedModel: {
        id: bestModel.modelId,
        name: modelInfo?.name || bestModel.modelId,
        algorithm: modelInfo?.algorithm || 'unknown'
      },
      alternativeModels: modelAssessments
        .filter(a => a.modelId !== bestModel.modelId)
        .slice(0, 3)
        .map(a => {
          const altModelInfo = this.modelRegistry.get(a.modelId)
          return {
            id: a.modelId,
            name: altModelInfo?.name || a.modelId,
            algorithm: altModelInfo?.algorithm || 'unknown',
            score: a.goodnessOfFit
          }
        })
    }

    this.selectionHistory.push(selection)
    return selection
  }

  /**
   * 评估模型拟合度
   */
  async evaluateModelFit(
    modelId: string,
    data: PredictionData
  ): Promise<ModelFitAssessment> {
    const modelInfo = this.modelRegistry.get(modelId)
    if (!modelInfo) {
      throw new Error(`未找到模型: ${modelId}`)
    }

    const dataComplexity = this.calculateDataComplexity(data)
    const modelComplexity = modelInfo.complexity

    const goodnessOfFit = this.calculateGoodnessOfFit(dataComplexity, modelComplexity, modelInfo)
    const stabilityMetrics = this.assessModelStability(modelInfo, data)
    const biasVarianceTradeoff = this.analyzeBiasVariance(dataComplexity, modelComplexity)
    const residualAnalysis = this.performResidualAnalysis(data)
    const recommendations = this.generateModelRecommendations(modelInfo, data, goodnessOfFit)

    return {
      modelId,
      goodnessOfFit,
      complexity: modelComplexity,
      trainingTime: modelInfo.averageTrainingTime,
      memoryUsage: modelInfo.memoryRequirement,
      overfittingRisk: modelComplexity > 0.7 ? 'high' : modelComplexity > 0.4 ? 'medium' : 'low',
      residualAnalysis,
      stabilityMetrics,
      biasVarianceTradeoff,
      recommendations
    }
  }

  /**
   * 分析数据特征
   */
  private analyzeDataCharacteristics(data: PredictionData): DataCharacteristics {
    const values = data.data?.map(p => p.value) || []
    const numericValues = values.map(v => Array.isArray(v) ? v[0] : v)
    const features = data.featuresList || []

    return {
      dataType: data.dataType,
      dataSize: data.data?.length || 0,
      featureCount: features.length,
      targetVariance: this.calculateVariance(numericValues),
      targetRange: numericValues.length > 0 ? Math.max(...numericValues) - Math.min(...numericValues) : 0,
      missingValueRate: this.calculateMissingRate(data),
      isTimeSeries: data.dataType === 'timeseries',
      seasonality: data.dataType === 'timeseries' ? this.detectSeasonality(numericValues) : null,
      trend: data.dataType === 'timeseries' ? this.detectTrend(numericValues) : null,
      noiseLevel: this.estimateNoiseLevel(numericValues),
      linearity: this.assessLinearity(data),
      outliers: this.detectOutliers(numericValues),
      dataFrequency: data.frequency,
      timeHorizon: data.data?.length || 0
    }
  }

  /**
   * 获取候选模型
   */
  private getCandidateModels(
    taskType: 'regression' | 'classification' | 'timeseries' | 'anomaly_detection',
    dataCharacteristics: DataCharacteristics,
    constraints: ModelConstraints
  ): string[] {
    const candidates: string[] = []

    switch (taskType) {
      case 'timeseries':
        if (dataCharacteristics.isTimeSeries) {
          candidates.push(
            'time_series_exponential_smoothing',
            'time_series_arima',
            'time_series_lstm',
            'time_series_prophet'
          )

          if (dataCharacteristics.seasonality?.detected) {
            candidates.push('time_series_seasonal_decomposition')
          }

          if (dataCharacteristics.trend?.trend) {
            candidates.push('time_series_trend_model')
          }
        }
        break

      case 'anomaly_detection':
        candidates.push(
          'statistical_anomaly_detection',
          'isolation_forest',
          'local_outlier_factor',
          'one_class_svm'
        )
        break

      case 'classification':
        candidates.push(
          'random_forest_classifier',
          'gradient_boosting_classifier',
          'logistic_regression',
          'neural_network_classifier'
        )
        break

      case 'regression':
        candidates.push(
          'linear_regression',
          'random_forest_regressor',
          'gradient_boosting_regressor',
          'svr'
        )
        break
    }

    return this.filterModelsByConstraints(candidates, dataCharacteristics, constraints)
  }

  /**
   * 根据约束条件筛选模型
   */
  private filterModelsByConstraints(
    models: string[],
    dataCharacteristics: DataCharacteristics,
    constraints: ModelConstraints
  ): string[] {
    return models.filter(modelId => {
      const modelInfo = this.modelRegistry.get(modelId)
      if (!modelInfo) return false

      if (constraints.maxTrainingTime && modelInfo.averageTrainingTime > constraints.maxTrainingTime) {
        return false
      }

      if (constraints.memoryLimit && modelInfo.memoryRequirement > constraints.memoryLimit) {
        return false
      }

      if (constraints.accuracyThreshold && modelInfo.expectedAccuracy < constraints.accuracyThreshold) {
        return false
      }

      if (dataCharacteristics.dataSize < modelInfo.minDataPoints) {
        return false
      }

      if (constraints.realTimeCapability && !modelInfo.supportsRealTime) {
        return false
      }

      return true
    })
  }

  /**
   * 选择最佳模型
   */
  private selectBestModel(
    assessments: ModelFitAssessment[],
    _task: PredictionTask,
    _constraints: ModelConstraints
  ): ModelFitAssessment {
    if (assessments.length === 0) {
      throw new Error('没有可用的模型')
    }

    const scoredAssessments = assessments.map(assessment => {
      let score = assessment.goodnessOfFit * 0.4
      score += (assessment.stabilityMetrics?.parameterStability ?? 0) * 0.3
      score += (assessment.stabilityMetrics?.predictionStability ?? 0) * 0.2

      return {
        ...assessment,
        score
      }
    })

    return scoredAssessments.reduce((best, current) => current.score > best.score ? current : best)
  }

  /**
   * 计算选择置信度
   */
  private calculateSelectionConfidence(model: ModelFitAssessment): number {
    const factors = [
      model.goodnessOfFit,
      model.stabilityMetrics?.parameterStability ?? 0,
      model.stabilityMetrics?.predictionStability ?? 0,
      1 - (model.biasVarianceTradeoff?.totalError ?? 0)
    ]

    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length
  }

  // 辅助分析方法

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  }

  private calculateMissingRate(data: PredictionData): number {
    let totalValues = 0
    let missingValues = 0

    if (!data.data) return 0

    for (const point of data.data) {
      totalValues++
      if (point.features) {
        totalValues += Object.keys(point.features).length
        missingValues += Object.values(point.features).filter(v => v === null || (typeof v === 'number' && isNaN(v))).length
      }
    }

    return totalValues > 0 ? missingValues / totalValues : 0
  }

  private detectSeasonality(values: number[]): SeasonalityInfo | null {
    if (values.length < 14) return null // 需要至少两周数据

    // 简化的季节性检测
    const periods = [7, 14, 30, 90]
    let bestPeriod = 0
    let bestCorrelation = 0

    for (const period of periods) {
      if (values.length >= period * 2) {
        const correlation = this.calculateSeasonalityCorrelation(values, period)
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation
          bestPeriod = period
        }
      }
    }

    if (bestCorrelation > 0.3) {
      return {
        detected: true,
        period: bestPeriod,
        strength: bestCorrelation
      }
    }

    return null
  }

  private detectTrend(values: number[]): { trend: boolean; direction?: 'increasing' | 'decreasing' | 'stable'; strength?: number } | null {
    if (values.length < 10) return null

    const n = values.length
    const x = Array.from({ length: n }, (_, i) => i)
    const y = values

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const r2 = this.calculateCorrelation(x, y) ** 2

    if (r2 > 0.3) {
      return {
        trend: true,
        direction: slope > 0 ? 'increasing' : 'decreasing',
        strength: r2
      }
    }

    return { trend: false }
  }

  private estimateNoiseLevel(values: number[]): number {
    if (values.length < 2) return 1

    // 使用相邻差异的标准差作为噪声估计
    const differences = []
    for (let i = 1; i < values.length; i++) {
      differences.push(values[i] - values[i - 1])
    }

    const noiseVariance = this.calculateVariance(differences)
    const signalVariance = this.calculateVariance(values)

    return signalVariance > 0 ? noiseVariance / signalVariance : 0
  }

  private assessLinearity(data: PredictionData): number {
    if (!data.featuresList || data.featuresList.length === 0) return 0
    if (!data.data || data.data.length === 0) return 0

    const featureName = data.featuresList[0]
    const targetValues = data.data.map(p => Array.isArray(p.value) ? p.value[0] : p.value)
    const firstFeature = data.data.map(p => {
      const featureValue = p.features?.[featureName]
      return typeof featureValue === 'number' ? featureValue : 0
    })

    return Math.abs(this.calculateCorrelation(firstFeature, targetValues))
  }

  private detectOutliers(values: number[]): number {
    if (values.length === 0) return 0

    const numericValues = values.map(v => Array.isArray(v) ? v[0] : v)
    const stats = this.calculateStatistics(numericValues)
    const threshold = stats.std * 2

    const outlierCount = numericValues.filter(v => Math.abs(v - stats.mean) > threshold).length
    return outlierCount / numericValues.length
  }

  private calculateStatistics(values: number[]): { mean: number; std: number } {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    return { mean, std: Math.sqrt(variance) }
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0

    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }

  private calculateSeasonalityCorrelation(values: number[], period: number): number {
    if (values.length < period * 2) return 0

    const correlations = []
    for (let lag = period; lag < Math.min(period * 3, values.length - period); lag += period) {
      const correlation = this.calculateCorrelation(
        values.slice(0, values.length - lag),
        values.slice(lag)
      )
      correlations.push(correlation)
    }

    return correlations.length > 0 ? correlations.reduce((a, b) => a + b, 0) / correlations.length : 0
  }

  private calculateDataComplexity(data: PredictionData): DataComplexity {
    const values = data.data?.map(p => p.value) || []
    const numericValues = values.map(v => Array.isArray(v) ? v[0] : v)

    return {
      size: data.data?.length || 0,
      features: data.featuresList?.length || 0,
      variance: this.calculateVariance(numericValues),
      linearity: this.assessLinearity(data),
      noise: this.estimateNoiseLevel(numericValues),
      seasonality: data.dataType === 'timeseries' ? this.detectSeasonality(numericValues) : null,
      outliers: this.detectOutliers(numericValues)
    }
  }

  private calculateGoodnessOfFit(
    dataComplexity: DataComplexity,
    modelComplexity: number,
    modelInfo: ModelInfo
  ): number {
    // 简化的拟合度计算
    const complexityMatch = 1 - Math.abs(dataComplexity.size - modelComplexity) / Math.max(dataComplexity.size, modelComplexity)
    const capabilityMatch = modelInfo.expectedAccuracy || 0.8

    return (complexityMatch + capabilityMatch) / 2
  }

  private assessModelStability(modelInfo: ModelInfo, _data: PredictionData): any {
    // 简化的稳定性评估
    return {
      parameterStability: modelInfo.stability,
      predictionStability: 0.8,
      temporalStability: 0.7,
      sensitivity: {
        noise: 0.3,
        complexity: modelInfo.complexity
      }
    }
  }

  private analyzeBiasVariance(dataComplexity: DataComplexity, modelComplexity: number): any {
    // 简化的偏差-方差分析
    const noise = dataComplexity.noise || 0.1
    const complexity = dataComplexity.size || 100

    const bias = Math.max(0.1, 1 - modelComplexity / 1000)
    const variance = noise + (modelComplexity / complexity) * 0.1

    return {
      bias,
      variance,
      irreducibleError: noise,
      totalError: bias + variance + noise,
      decomposition: 'bias2'
    }
  }

  private performResidualAnalysis(data: PredictionData): any {
    // 简化的残差分析
    const values = data.data?.map(p => p.value) || []
    if (values.length === 0) {
      return {
        meanError: 0,
        stdError: 0,
        skewness: 0,
        kurtosis: 0,
        autocorrelation: 0,
        heteroscedasticity: false
      }
    }

    const numericValues = values.map(v => Array.isArray(v) ? v[0] : v)
    const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
    const residuals = numericValues.map(v => v - mean)

    return {
      meanError: 0,
      stdError: this.calculateStatistics(residuals).std,
      skewness: 0,
      kurtosis: 0,
      autocorrelation: 0.1,
      heteroscedasticity: false
    }
  }

  private generateModelRecommendations(
    modelInfo: ModelInfo,
    data: PredictionData,
    goodnessOfFit: number
  ): string[] {
    const recommendations = []

    if (goodnessOfFit < 0.6) {
      recommendations.push('考虑增加数据量或特征工程')
    }

    if (modelInfo.complexity > 0.8) {
      recommendations.push('模型较复杂，注意过拟合风险')
    }

    if (data.features && Object.keys(data.features).length < 5) {
      recommendations.push('考虑增加更多特征以提升模型性能')
    }

    return recommendations
  }

  private initializeModelRegistry(): void {
    this.modelRegistry.set('time_series_exponential_smoothing', {
      id: 'time_series_exponential_smoothing',
      name: '指数平滑',
      algorithm: 'exponential_smoothing',
      type: 'forecasting',
      complexity: 0.3,
      expectedAccuracy: 0.8,
      averageTrainingTime: 100,
      memoryRequirement: 50,
      minDataPoints: 10,
      supportsRealTime: true,
      stability: 0.9
    })

    this.modelRegistry.set('time_series_arima', {
      id: 'time_series_arima',
      name: 'ARIMA',
      algorithm: 'arima',
      type: 'forecasting',
      complexity: 0.7,
      expectedAccuracy: 0.85,
      averageTrainingTime: 500,
      memoryRequirement: 200,
      minDataPoints: 50,
      supportsRealTime: false,
      stability: 0.7
    })

    this.modelRegistry.set('statistical_anomaly_detection', {
      id: 'statistical_anomaly_detection',
      name: '统计异常检测',
      algorithm: 'statistical',
      type: 'anomaly_detection',
      complexity: 0.4,
      expectedAccuracy: 0.9,
      averageTrainingTime: 200,
      memoryRequirement: 100,
      minDataPoints: 20,
      supportsRealTime: true,
      stability: 0.8
    })

    this.modelRegistry.set('random_forest_regressor', {
      id: 'random_forest_regressor',
      name: '随机森林回归',
      algorithm: 'random_forest',
      type: 'regression',
      complexity: 0.6,
      expectedAccuracy: 0.85,
      averageTrainingTime: 1000,
      memoryRequirement: 300,
      minDataPoints: 50,
      supportsRealTime: false,
      stability: 0.9
    })

    this.modelRegistry.set('gradient_boosting_regressor', {
      id: 'gradient_boosting_regressor',
      name: '梯度提升回归',
      algorithm: 'gradient_boosting',
      type: 'regression',
      complexity: 0.8,
      expectedAccuracy: 0.9,
      averageTrainingTime: 1500,
      memoryRequirement: 400,
      minDataPoints: 50,
      supportsRealTime: false,
      stability: 0.7
    })
  }
}



interface SeasonalityInfo {
  detected: boolean
  period: number
  strength: number
}

interface DataComplexity {
  size: number
  features: number
  variance: number
  linearity: number
  noise: number
  seasonality: SeasonalityInfo | null
  outliers: number
}
