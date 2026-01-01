export type ScheduleType = 'learning' | 'play' | 'exercise' | 'rest' | 'meal' | 'custom'

export type SchedulePriority = 'high' | 'medium' | 'low'

export type ScheduleStatus = 'pending' | 'completed' | 'cancelled' | 'in_progress'

export interface Schedule {
  id: string
  childId: string
  parentId: string
  type: ScheduleType
  title: string
  description?: string
  startTime: Date
  endTime: Date
  priority: SchedulePriority
  status: ScheduleStatus
  location?: string
  participants?: string[]
  reminders?: Date[]
  notes?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ScheduleFormData {
  type: ScheduleType
  title: string
  description?: string
  startTime: Date
  endTime: Date
  priority: SchedulePriority
  location?: string
  participants?: string[]
  reminders?: Date[]
  notes?: string
}

export interface ScheduleStats {
  totalSchedules: number
  completedSchedules: number
  pendingSchedules: number
  cancelledSchedules: number
  typeDistribution: Record<ScheduleType, number>
  priorityDistribution: Record<SchedulePriority, number>
  completionRate: number
  upcomingSchedules: Schedule[]
  todaySchedules: Schedule[]
}

export interface ScheduleTypeConfig {
  icon: string
  color: string
  name: string
  description: string
  defaultDuration: number
}

export const SCHEDULE_TYPE_CONFIG: Record<ScheduleType, ScheduleTypeConfig> = {
  learning: {
    icon: '📖',
    color: 'blue',
    name: '学习',
    description: '学习活动',
    defaultDuration: 60
  },
  play: {
    icon: '🎮',
    color: 'purple',
    name: '娱乐',
    description: '娱乐活动',
    defaultDuration: 45
  },
  exercise: {
    icon: '🏃',
    color: 'green',
    name: '运动',
    description: '运动锻炼',
    defaultDuration: 30
  },
  rest: {
    icon: '😴',
    color: 'gray',
    name: '休息',
    description: '休息时间',
    defaultDuration: 30
  },
  meal: {
    icon: '🍽️',
    color: 'orange',
    name: '用餐',
    description: '用餐时间',
    defaultDuration: 30
  },
  custom: {
    icon: '📝',
    color: 'indigo',
    name: '自定义',
    description: '自定义活动',
    defaultDuration: 60
  }
}

export function getScheduleColor(type: ScheduleType): string {
  return SCHEDULE_TYPE_CONFIG[type].color
}

export function getScheduleIcon(type: ScheduleType): string {
  return SCHEDULE_TYPE_CONFIG[type].icon
}

export function getScheduleLabel(type: ScheduleType): string {
  return SCHEDULE_TYPE_CONFIG[type].name
}
