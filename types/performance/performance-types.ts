export interface SlowRequest {
  name: string
  duration: number
  size: number
}

export interface LayoutShiftEntry {
  value: number
  hadRecentInput: boolean
}

export interface FirstInputEntry {
  processingStart: number
  startTime: number
}

export interface PerformanceMemory {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

export interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory
}
