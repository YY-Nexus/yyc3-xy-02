export type ArtStyle = "cartoon" | "watercolor" | "pixel" | "sketch" | "3d_render" | "anime"

export type StoryStyle = "fairy_tale" | "adventure" | "sci_fi" | "fantasy" | "mystery"

export type BookCategory = "story" | "science" | "emotion" | "habit" | "culture" | "english" | "math" | "nature"

export interface ArtStyleConfig {
  name: string
  prompt: string
  description: string
  color: string
  icon: string
}

export interface StoryStyleConfig {
  name: string
  prompt: string
  description: string
  color: string
  icon: string
}

export const ART_STYLE_CONFIG: Record<ArtStyle, ArtStyleConfig> = {
  cartoon: {
    name: "卡通风格",
    prompt: "cartoon style, vibrant colors, cute characters, smooth lines",
    description: "适合儿童的可爱卡通风格",
    color: "#8B5CF6",
    icon: "ri-mickey-line"
  },
  watercolor: {
    name: "水彩画",
    prompt: "watercolor painting, soft colors, artistic, dreamy",
    description: "柔和的水彩画风格",
    color: "#EC4899",
    icon: "ri-palette-line"
  },
  pixel: {
    name: "像素艺术",
    prompt: "pixel art, 8-bit style, retro, colorful",
    description: "复古像素艺术风格",
    color: "#F59E0B",
    icon: "ri-gamepad-line"
  },
  sketch: {
    name: "素描",
    prompt: "pencil sketch, hand-drawn, artistic, detailed",
    description: "手绘素描风格",
    color: "#6B7280",
    icon: "ri-pencil-line"
  },
  "3d_render": {
    name: "3D渲染",
    prompt: "3D render, smooth lighting, modern, high quality",
    description: "现代3D渲染风格",
    color: "#3B82F6",
    icon: "ri-box-3-line"
  },
  anime: {
    name: "动漫风格",
    prompt: "anime style, vibrant, expressive, detailed",
    description: "日本动漫风格",
    color: "#EF4444",
    icon: "ri-star-line"
  }
}

export const STORY_STYLE_CONFIG: Record<StoryStyle, StoryStyleConfig> = {
  fairy_tale: {
    name: "童话故事",
    prompt: "童话风格，温馨，魔法，友谊",
    description: "适合儿童的经典童话风格",
    color: "#8B5CF6",
    icon: "ri-magic-line"
  },
  adventure: {
    name: "冒险故事",
    prompt: "冒险风格，探索，勇敢，成长",
    description: "充满冒险和探索的故事",
    color: "#F59E0B",
    icon: "ri-compass-3-line"
  },
  sci_fi: {
    name: "科幻故事",
    prompt: "科幻风格，未来，科技，想象",
    description: "充满科技感和想象力的故事",
    color: "#3B82F6",
    icon: "ri-rocket-line"
  },
  fantasy: {
    name: "奇幻故事",
    prompt: "奇幻风格，魔法，神秘，奇迹",
    description: "充满魔法和奇迹的奇幻故事",
    color: "#EC4899",
    icon: "ri-sparkling-line"
  },
  mystery: {
    name: "悬疑故事",
    prompt: "悬疑风格，解谜，智慧，发现",
    description: "引人入胜的悬疑解谜故事",
    color: "#10B981",
    icon: "ri-search-eye-line"
  }
}

export interface BookCategoryConfig {
  name: string
  description: string
  color: string
  icon: string
  ageRange: string
}

export const BOOK_CATEGORY_CONFIG: Record<BookCategory, BookCategoryConfig> = {
  story: {
    name: "故事",
    description: "经典童话和故事",
    color: "#8B5CF6",
    icon: "ri-book-open-line",
    ageRange: "3-10岁"
  },
  science: {
    name: "科学",
    description: "科学探索和发现",
    color: "#3B82F6",
    icon: "ri-flask-line",
    ageRange: "5-12岁"
  },
  emotion: {
    name: "情感",
    description: "情感教育和情商培养",
    color: "#EC4899",
    icon: "ri-heart-line",
    ageRange: "3-8岁"
  },
  habit: {
    name: "习惯",
    description: "生活习惯和行为培养",
    color: "#10B981",
    icon: "ri-calendar-check-line",
    ageRange: "3-8岁"
  },
  culture: {
    name: "文化",
    description: "传统文化和艺术",
    color: "#F59E0B",
    icon: "ri-ancient-gate-line",
    ageRange: "5-12岁"
  },
  english: {
    name: "英语",
    description: "英语启蒙和学习",
    color: "#6366F1",
    icon: "ri-translate-2",
    ageRange: "4-10岁"
  },
  math: {
    name: "数学",
    description: "数学思维和逻辑",
    color: "#EF4444",
    icon: "ri-calculator-line",
    ageRange: "5-10岁"
  },
  nature: {
    name: "自然",
    description: "自然观察和探索",
    color: "#22C55E",
    icon: "ri-plant-line",
    ageRange: "3-10岁"
  }
}

export interface GeneratedArtwork {
  id: string
  prompt: string
  imageUrl: string
  thumbnailUrl: string
  style: ArtStyle
  aspectRatio: string
  createdAt: string
  isFavorite: boolean
  childId?: string
}

export interface ImageGenerationRequest {
  prompt: string
  style: ArtStyle
  aspectRatio: string
  childId?: string
}

export interface StorySession {
  id: string
  title: string
  style: StoryStyle
  keywords: string[]
  segments: StorySegment[]
  createdAt: string
  updatedAt: string
  childId?: string
  status: "active" | "completed"
}

export interface StorySegment {
  id: string
  content: string
  author: "child" | "ai"
  timestamp: string
}

export interface ContinuationOption {
  id: string
  content: string
  style: string
  direction: string
}

export interface BookPage {
  pageNumber: number
  imageUrl: string
  text: string
}

export interface PictureBook {
  id: string
  title: string
  author: string
  coverUrl: string
  category: BookCategory
  ageRange: [number, number]
  duration: number
  isAIGenerated: boolean
  isFavorite: boolean
  readCount: number
  createdAt: Date
  pages: BookPage[]
}

export interface ReadingProgress {
  bookId: string
  childId: string
  currentPage: number
  totalPages: number
  startedAt: Date
  lastReadAt: Date
  isCompleted: boolean
}
