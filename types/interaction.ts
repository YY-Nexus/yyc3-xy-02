export type InteractionType = 'reading' | 'play' | 'outdoor' | 'study' | 'art' | 'music' | 'game'

export type MoodType = 'excellent' | 'good' | 'neutral' | 'poor'

export interface InteractionAnalysis {
  keywords: string[]
  sentiment: '积极' | '一般' | '消极'
  themes: string[]
  qualityScore: number
  suggestions: string[]
  milestoneDetected?: string
}

export interface InteractionRecord {
  id: string
  childId: string
  parentId: string
  type: InteractionType
  title: string
  content: string
  mediaUrls: string[]
  duration: number
  participants: string[]
  location?: string
  mood: MoodType
  aiAnalysis?: InteractionAnalysis
  createdAt: Date
  updatedAt: Date
}

export interface InteractionStats {
  totalCount: number
  typeDistribution: Record<InteractionType, number>
  averageDuration: number
  moodDistribution: Record<MoodType, number>
  qualityScores: {
    average: number
    distribution: Record<'low' | 'medium' | 'high', number>
  }
  recentInteractions: InteractionRecord[]
}

export interface InteractionTypeConfig {
  icon: string
  color: string
  name: string
  description: string
  recommendedDuration: number
}

export interface MoodConfig {
  icon: string
  color: string
  name: string
  description: string
}

export const INTERACTION_TYPE_CONFIG: Record<InteractionType, InteractionTypeConfig> = {
  reading: {
    icon: '📚',
    color: 'blue',
    name: '阅读时光',
    description: '亲子共读，培养阅读兴趣',
    recommendedDuration: 30
  },
  play: {
    icon: '🎮',
    color: 'purple',
    name: '游戏互动',
    description: '趣味游戏，增进感情',
    recommendedDuration: 45
  },
  outdoor: {
    icon: '🌳',
    color: 'green',
    name: '户外活动',
    description: '亲近自然，锻炼身体',
    recommendedDuration: 60
  },
  study: {
    icon: '✏️',
    color: 'orange',
    name: '学习辅导',
    description: '学业指导，共同进步',
    recommendedDuration: 40
  },
  art: {
    icon: '🎨',
    color: 'pink',
    name: '艺术创作',
    description: '创意表达，审美培养',
    recommendedDuration: 50
  },
  music: {
    icon: '🎵',
    color: 'indigo',
    name: '音乐欣赏',
    description: '音乐熏陶，陶冶情操',
    recommendedDuration: 30
  },
  game: {
    icon: '🎯',
    color: 'red',
    name: '运动游戏',
    description: '运动健身，快乐成长',
    recommendedDuration: 45
  }
}

export const MOOD_CONFIG: Record<MoodType, MoodConfig> = {
  excellent: {
    icon: '😊',
    color: 'green',
    name: '非常开心',
    description: '孩子表现非常积极'
  },
  good: {
    icon: '🙂',
    color: 'blue',
    name: '开心',
    description: '孩子表现良好'
  },
  neutral: {
    icon: '😐',
    color: 'gray',
    name: '一般',
    description: '孩子表现正常'
  },
  poor: {
    icon: '😔',
    color: 'orange',
    name: '不太开心',
    description: '需要更多关注'
  }
}

export function getInteractionConfig(type: InteractionType): InteractionTypeConfig {
  return INTERACTION_TYPE_CONFIG[type]
}

export function getMoodConfig(mood: MoodType): MoodConfig {
  return MOOD_CONFIG[mood]
}

export function calculateQualityLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}
