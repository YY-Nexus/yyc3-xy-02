import type { PredictionData } from './common'

export interface FeatureData {
  [key: string]: number | string | boolean | null | undefined | unknown[] | Record<string, unknown>
}

export interface NormalizedFeatureData {
  [key: string]: number | string | boolean
}

export interface HyperparameterRange {
  [key: string]: {
    min?: number
    max?: number
    step?: number
    values?: (string | number | boolean)[]
    type?: 'continuous' | 'discrete' | 'categorical'
  }
}

export interface HyperparameterConfig {
  [key: string]: number | string | boolean | (number | string | boolean)[]
}

export interface CrossValidationScore {
  fold: number
  score: number
  accuracy: number
  precision?: number
  recall?: number
  f1Score?: number
}

export interface ModelData {
  type: string
  timestamp: string
  modelId: string
  algorithm: string
  parameters: Record<string, unknown>
  trainingMetrics?: {
    accuracy?: number
    loss?: number
    [key: string]: unknown
  }
}
