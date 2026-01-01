export type VideoType = 'story' | 'animation' | 'music' | 'educational' | 'custom'

export type VideoStyle = 'cartoon' | 'realistic' | 'watercolor' | 'pixel' | '3d'

export type VideoStatus = 'generating' | 'completed' | 'failed' | 'cancelled'

export interface GeneratedVideo {
  id: string
  userId: string
  childId?: string
  type: VideoType
  style: VideoStyle
  title: string
  description?: string
  prompt: string
  thumbnailUrl?: string
  videoUrl?: string
  duration?: number
  resolution?: string
  status: VideoStatus
  errorMessage?: string
  isFavorite: boolean
  viewCount: number
  tags: string[]
  metadata?: {
    model?: string
    parameters?: Record<string, unknown>
    generationTime?: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface VideoGenerationRequest {
  type: VideoType
  style: VideoStyle
  title: string
  description?: string
  prompt: string
  childId?: string
  tags?: string[]
  parameters?: Record<string, unknown>
}

export interface VideoGenerationResponse {
  videoId: string
  status: VideoStatus
  estimatedTime?: number
  message?: string
}

export interface VideoStats {
  totalVideos: number
  favoriteVideos: number
  typeDistribution: Record<VideoType, number>
  styleDistribution: Record<VideoStyle, number>
  totalViews: number
  averageViews: number
  recentVideos: GeneratedVideo[]
  popularVideos: GeneratedVideo[]
}

export interface VideoStyleConfig {
  icon: string
  color: string
  name: string
  description: string
  previewImage?: string
}

export const VIDEO_STYLE_CONFIG: Record<VideoStyle, VideoStyleConfig> = {
  cartoon: {
    icon: '🎨',
    color: 'pink',
    name: '卡通风格',
    description: '可爱有趣的卡通动画',
    previewImage: '/images/styles/cartoon-preview.png'
  },
  realistic: {
    icon: '📷',
    color: 'blue',
    name: '写实风格',
    description: '逼真的写实画面',
    previewImage: '/images/styles/realistic-preview.png'
  },
  watercolor: {
    icon: '🖌️',
    color: 'purple',
    name: '水彩风格',
    description: '柔和的水彩画风',
    previewImage: '/images/styles/watercolor-preview.png'
  },
  pixel: {
    icon: '👾',
    color: 'green',
    name: '像素风格',
    description: '复古的像素艺术',
    previewImage: '/images/styles/pixel-preview.png'
  },
  '3d': {
    icon: '🎬',
    color: 'orange',
    name: '3D风格',
    description: '立体的3D效果',
    previewImage: '/images/styles/3d-preview.png'
  }
}

export interface VideoTypeConfig {
  icon: string
  color: string
  name: string
  description: string
  examples: string[]
}

export const VIDEO_TYPE_CONFIG: Record<VideoType, VideoTypeConfig> = {
  story: {
    icon: '📖',
    color: 'blue',
    name: '故事视频',
    description: '生成有趣的故事动画',
    examples: ['小红帽的故事', '三只小猪', '龟兔赛跑']
  },
  animation: {
    icon: '🎬',
    color: 'purple',
    name: '动画短片',
    description: '创作原创动画短片',
    examples: ['冒险故事', '科幻动画', '奇幻世界']
  },
  music: {
    icon: '🎵',
    color: 'pink',
    name: '音乐视频',
    description: '制作音乐可视化视频',
    examples: ['儿歌MV', '音乐动画', '节奏游戏']
  },
  educational: {
    icon: '📚',
    color: 'green',
    name: '教育视频',
    description: '生成教育类动画',
    examples: ['数学启蒙', '英语学习', '科学实验']
  },
  custom: {
    icon: '✨',
    color: 'orange',
    name: '自定义视频',
    description: '自由创作任意类型视频',
    examples: ['创意短片', '个人作品', '实验性视频']
  }
}

export function getVideoStyleConfig(style: VideoStyle): VideoStyleConfig {
  return VIDEO_STYLE_CONFIG[style]
}

export function getVideoTypeConfig(type: VideoType): VideoTypeConfig {
  return VIDEO_TYPE_CONFIG[type]
}

export function getVideoStatusLabel(status: VideoStatus): string {
  const labels: Record<VideoStatus, string> = {
    generating: '生成中',
    completed: '已完成',
    failed: '生成失败',
    cancelled: '已取消'
  }
  return labels[status]
}
