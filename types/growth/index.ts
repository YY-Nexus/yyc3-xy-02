export interface Observation {
  id?: string
  category: string
  description: string
  positive: boolean
  timestamp?: Date
  observer?: string
  context?: string
}

export interface ParentReport {
  id?: string
  category: string
  description: string
  positive: boolean
  timestamp?: Date
  reporter?: string
  context?: string
}

export interface MilestoneResult {
  milestoneId: string
  achieved: boolean
  notes?: string
  evidence?: string[]
}

export interface DevelopmentTrend {
  category: string
  direction: 'improving' | 'declining' | 'stable'
  change: number
  currentScore: number
  timeframe?: string
}

export interface ChildProfile {
  id: string
  name: string
  birthDate: Date
  gender?: 'male' | 'female'
  interests?: string[]
  strengths?: string[]
  areasForImprovement?: string[]
  notes?: string
  medicalHistory?: string[]
  allergies?: string[]
  specialNeeds?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface DevelopmentReport {
  assessments: DevelopmentalAssessment[]
  insights: GrowthInsight[]
  trends: DevelopmentTrend[]
  recommendations: string[]
}

export interface DevelopmentalMilestone {
  id: string
  category: 'physical' | 'cognitive' | 'emotional' | 'social' | 'language'
  ageRange: {
    min: number
    max: number
  }
  title: string
  description: string
  indicators: string[]
  assessmentCriteria: string[]
  resources: Array<{
    type: 'article' | 'video' | 'exercise' | 'activity'
    title: string
    url?: string
    description: string
  }>
}

export interface DevelopmentalAssessment {
  id: string
  childId: string
  age: number
  assessmentDate: Date
  categories: {
    physical: {
      score: number
      milestones: MilestoneResult[]
      recommendations: string[]
    }
    cognitive: {
      score: number
      milestones: MilestoneResult[]
      recommendations: string[]
    }
    emotional: {
      score: number
      milestones: MilestoneResult[]
      recommendations: string[]
    }
    social: {
      score: number
      milestones: MilestoneResult[]
      recommendations: string[]
    }
    language: {
      score: number
      milestones: MilestoneResult[]
      recommendations: string[]
    }
  }
  overallScore: number
  summary: string
  nextAssessmentDate: Date
  priority: 'low' | 'medium' | 'high'
}

export interface GrowthInsight {
  id: string
  type: 'milestone' | 'concern' | 'opportunity' | 'recommendation'
  title: string
  description: string
  confidence: number
  timeframe: string
  actionable: boolean
  suggestedActions: string[]
  resources: Array<{
    type: 'article' | 'video' | 'exercise' | 'specialist'
    title: string
    description: string
  }>
  priority: 'low' | 'medium' | 'high'
}
