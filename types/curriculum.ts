export type CourseType = "school" | "extracurricular" | "online"

export interface CourseSchedule {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room: string
}

export interface Course {
  id: string
  childId: string
  name: string
  subject: string
  teacher?: string
  location?: string
  type: CourseType
  color: string
  schedules: CourseSchedule[]
  notes: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Semester {
  id: string
  name: string
  startDate: Date
  endDate: Date
  schoolYear: string
}

export const WEEKDAYS = [
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
  "周日",
] as const

export const TIME_SLOTS = [
  "08:00",
  "08:45",
  "09:00",
  "09:45",
  "10:00",
  "10:45",
  "11:00",
  "11:45",
  "14:00",
  "14:45",
  "15:00",
  "15:45",
  "16:00",
  "16:45",
  "17:00",
  "17:45",
  "18:00",
  "18:45",
  "19:00",
  "19:45",
  "20:00",
  "20:45",
] as const

export const COURSE_TYPES = [
  { value: "school", label: "校内课程", icon: "ri-school-line" },
  { value: "extracurricular", label: "兴趣班", icon: "ri-palette-line" },
  { value: "online", label: "线上课程", icon: "ri-computer-line" },
] as const

export const SUBJECT_COLORS: Record<string, string> = {
  语文: "#ef4444",
  数学: "#3b82f6",
  英语: "#10b981",
  物理: "#f59e0b",
  化学: "#8b5cf6",
  生物: "#06b6d4",
  历史: "#f97316",
  地理: "#14b8a6",
  政治: "#ec4899",
  体育: "#84cc16",
  音乐: "#a855f7",
  美术: "#f43f5e",
  科学: "#0ea5e9",
  钢琴: "#d946ef",
  编程: "#6366f1",
  书法: "#78716c",
  舞蹈: "#f472b6",
  棋类: "#a3a3a3",
  阅读: "#4ade80",
  写作: "#fb923c",
  口语: "#38bdf8",
  其他: "#6b7280",
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}-${endTime}`
}

export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(":").map(Number)
  const [endHour, endMin] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  return endMinutes - startMinutes
}

export function getDefaultSemester(): Semester {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  let startDate: Date
  let endDate: Date
  let name: string

  if (month >= 1 && month <= 6) {
    name = `${year}春季学期`
    startDate = new Date(year, 1, 1)
    endDate = new Date(year, 6, 30)
  } else if (month >= 8 && month <= 12) {
    name = `${year}秋季学期`
    startDate = new Date(year, 8, 1)
    endDate = new Date(year, 11, 31)
  } else {
    name = `${year}暑假`
    startDate = new Date(year, 6, 1)
    endDate = new Date(year, 7, 31)
  }

  return {
    id: `semester_${Date.now()}`,
    name,
    startDate,
    endDate,
    schoolYear: `${year}`,
  }
}

export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS["其他"]
}
