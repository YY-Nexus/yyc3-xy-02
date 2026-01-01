/**
 * YYC³ AI小语智能成长守护系统 - Bun 测试设置
 * Phase 1 Week 5-6: 测试体系建设
 */

import { expect, beforeEach, afterEach } from 'bun:test'

// 设置测试环境
global.expect = expect

// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}

global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}

global.sessionStorage = sessionStorageMock

// Mock fetch
global.fetch = () => Promise.resolve({
  ok: true,
  status: 200,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
}) as Response

// Mock WebSocket
global.WebSocket = class {
  constructor() {
    this.readyState = 1
  }
  send() {}
  close() {}
  onopen = null
  onclose = null
  onmessage = null
  onerror = null
} as any

// Mock ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

// Mock IntersectionObserver
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

// Mock window.matchMedia
Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// 全局测试工具函数
global.createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'parent',
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

global.createMockChild = (overrides = {}) => ({
  id: 'child-123',
  name: 'Test Child',
  birthDate: '2020-01-01',
  gender: 'male',
  parentId: 'user-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

global.createMockAIMessage = (overrides = {}) => ({
  id: 'message-123',
  sessionId: 'session-123',
  userMessage: 'Hello',
  aiResponse: 'Hi there!',
  aiRole: 'listener',
  aiRoleName: '聆听者',
  emotion: 'happy',
  createdAt: new Date().toISOString(),
  ...overrides,
})

global.createMockGrowthRecord = (overrides = {}) => ({
  id: 'record-123',
  childId: 'child-123',
  childName: 'Test Child',
  title: 'First Steps',
  description: 'Took first steps today',
  category: 'milestone',
  mediaUrls: [],
  tags: ['milestone', 'development'],
  location: 'Home',
  isPublic: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

// 重置函数
beforeEach(() => {
  // 清理localStorage
  Object.keys(localStorageMock).forEach(key => {
    delete (localStorageMock as any)[key]
  })

  // 清理sessionStorage
  Object.keys(sessionStorageMock).forEach(key => {
    delete (sessionStorageMock as any)[key]
  })
})

afterEach(() => {
  // 清理工作
})