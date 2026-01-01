export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatarUrl?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: AuthUser
  tokens: AuthTokens
}

export interface UserProfile {
  user: AuthUser
  stats?: UserStats
}

export interface UserStats {
  totalConversations?: number
  totalGrowthRecords?: number
  activeDays?: number
  lastActiveAt?: string
}

export interface ChatContext {
  sessionId: string
  childId: string
  aiRole: string
  messageHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  emotion?: string
  metadata?: Record<string, unknown>
}

export interface ChatResponse {
  sessionId: string
  message: string
  aiResponse: string
  aiRole: string
  aiRoleName: string
  emotion: string
  context: ChatContext
}

export interface GrowthRecordFilters {
  category?: string
  tags?: string[]
  startDate?: string
  endDate?: string
  isPublic?: boolean
  sortBy?: string
  sortOrder?: string
}

export interface GrowthRecordsResponse {
  child: {
    id: string
    name: string
  }
  growthRecords: Array<{
    id: string
    title: string
    description: string
    category: string
    mediaUrls: string[]
    tags: string[]
    location: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: GrowthRecordFilters
}

export interface SearchGrowthRecordsResponse {
  child: {
    id: string
    name: string
  }
  query: string
  growthRecords: Array<{
    id: string
    title: string
    description: string
    category: string
    mediaUrls: string[]
    tags: string[]
    location: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: GrowthRecordFilters
}
