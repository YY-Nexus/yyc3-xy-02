/**
 * @file Analytics 类型定义
 * @description 数据分析系统相关类型定义
 * @module types/analytics
 * @author YYC³ Team
 * @version 1.0.0
 */

export interface RealtimeMetrics {
  timestamp: Date
  activeUsers: number
  totalUsers: number
  aiConversations: number
  averageSatisfaction: number
  learningTime: number
  systemHealth: number
  anomalies: AnomalyEvent[]
}

export interface AnomalyEvent {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
  affectedUsers?: number
  metrics?: Record<string, number>
}

export interface EventData {
  eventId: string
  userId: string
  sessionId?: string
  eventType: 'user_action' | 'ai_interaction' | 'growth_update' | 'recommendation_feedback' | 'system_metric'
  eventTimestamp: Date
  properties: Record<string, any>
  source: string
}

export interface UserActivityPattern {
  userId: string
  lastActivity: Date
  sessionDuration: number
  actionsCount: number
  engagementScore: number
  riskLevel: 'low' | 'medium' | 'high'
}

export interface MetricsOverview {
  totalUsers: number
  activeUsers: number
  aiConversations: number
  averageSatisfaction: number
  learningTime: number
  systemHealth: number
}

export interface TrendData {
  timestamp: Date
  value: number
  category?: string
}

export interface TimeRange {
  label: string
  value: string
  hours: number
}

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: Date
}

export interface ConnectionStatus {
  connected: boolean
  lastConnected?: Date
  reconnectAttempts: number
}

export interface AlertConfig {
  enabled: boolean
  threshold: number
  severity: 'info' | 'warning' | 'error' | 'critical'
}

export interface DashboardConfig {
  refreshInterval: number
  autoReconnect: boolean
  showAnomalies: boolean
  alertThresholds: Record<string, AlertConfig>
}
