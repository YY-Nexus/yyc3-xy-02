/**
 * YYC³ AI小语智能成长守护系统 - Hooks测试
 * @file useGrowthRecords.test.ts
 * @description 成长记录相关Hooks的单元测试
 * @author YYC³团队 <admin@0379.email>
 * @version 1.0.0
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useGrowthRecords, useGrowthCategories, useGrowthRecordStats } from '@/hooks/useGrowthRecords'

// Mock API client

// 使用Jest的mock函数
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    getGrowthRecords: jest.fn(),
    getGrowthRecord: jest.fn(),
    createGrowthRecord: jest.fn(),
    updateGrowthRecord: jest.fn(),
    deleteGrowthRecord: jest.fn(),
    searchGrowthRecords: jest.fn(),
    getGrowthStats: jest.fn()
  }
}))

// 导入并类型转换模拟的apiClient
import { apiClient } from '@/lib/api/client'
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

// 创建模拟的growth record函数
const createMockGrowthRecord = (overrides = {}) => ({
  id: `record-${Date.now()}`,
  childId: 'child-123',
  title: '测试成长记录',
  description: '这是一条测试成长记录',
  category: 'milestone',
  mediaUrls: [],
  tags: [],
  location: '',
  isPublic: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

describe('useGrowthRecords', () => {
  const childId = 'child-123'

  beforeEach(() => {
    // 清除所有mock调用历史
    jest.clearAllMocks()
  })

  describe('初始化', () => {
    it('应该初始化正确的默认值', () => {
      const { result } = renderHook(() => useGrowthRecords())

      expect(result.current.records).toEqual([])
      expect(result.current.stats).toBe(null)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.pagination).toBe(null)
      expect(result.current.filters).toEqual({})
    })
  })

  describe('加载记录', () => {
    it('应该成功加载成长记录', async () => {
      const mockRecords = [
        createMockGrowthRecord({
          id: 'record-1',
          title: '第一次爬行',
          category: 'milestone',
        }),
        createMockGrowthRecord({
          id: 'record-2',
          title: '今天学会了叫妈妈',
          category: 'daily',
        }),
      ]

      const mockPagination = {
        page: 1,
        limit: 20,
        total: 2,
        pages: 1,
      }

      mockApiClient.getGrowthRecords.mockResolvedValue({
        success: true,
        data: {
          child: { id: 'child-123', name: 'Test Child' },
          growthRecords: mockRecords,
          pagination: mockPagination,
          filters: {},
        },
      })

      const { result } = renderHook(() => useGrowthRecords(childId))

      await waitFor(() => {
        expect(result.current.records).toEqual(mockRecords)
        expect(result.current.pagination).toEqual(mockPagination)
        expect(result.current.isLoading).toBe(false)
      })

      expect(apiClient.getGrowthRecords).toHaveBeenCalledWith(childId, {
        category: undefined,
        tags: undefined,
        startDate: undefined,
        endDate: undefined,
        sortBy: undefined,
        sortOrder: undefined,
        page: 1,
      })
    })

    it('应该处理加载错误', async () => {
      mockApiClient.getGrowthRecords.mockRejectedValue(new Error('加载失败'))

      const { result } = renderHook(() => useGrowthRecords(childId))

      await waitFor(() => {
        expect(result.current.error).toBe('加载失败')
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('创建记录', () => {
    it('应该成功创建成长记录', async () => {
      const newRecord = {
        childId,
        title: '新的成长记录',
        description: '这是一条新的成长记录',
        category: 'milestone' as const,
        mediaUrls: [],
        tags: ['重要'],
        location: '家里',
        isPublic: false,
      }

      const createdRecord = createMockGrowthRecord(newRecord)
      
      mockApiClient.createGrowthRecord.mockResolvedValue({
        success: true,
        data: { growthRecord: createdRecord },
      })

      // Mock获取记录
      mockApiClient.getGrowthRecords.mockResolvedValue({
        success: true,
        data: {
          child: { id: 'child-123', name: 'Test Child' },
          growthRecords: [createdRecord],
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
          filters: {},
        },
      })

      const { result } = renderHook(() => useGrowthRecords(childId))

      const success = await result.current.createRecord(newRecord)

      expect(success).toBe(true)
      expect(apiClient.createGrowthRecord).toHaveBeenCalledWith({
        ...newRecord,
        title: newRecord.title.trim(),
      })
    })

    it('应该验证必填字段', async () => {
      const { result } = renderHook(() => useGrowthRecords(childId))

      // 缺少childId
      const success1 = await result.current.createRecord({
        childId: '',
        title: '测试记录',
        category: 'milestone',
      })

      expect(success1).toBe(false)
      expect(mockApiClient.createGrowthRecord).not.toHaveBeenCalled()
    })
  })

  describe('过滤和错误处理', () => {
    it('应该设置和重置过滤器', async () => {
      mockApiClient.getGrowthRecords.mockResolvedValue({
        success: true,
        data: {
          child: { id: 'child-123', name: 'Test Child' },
          growthRecords: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 },
          filters: {},
        },
      })

      const { result } = renderHook(() => useGrowthRecords(childId))

      // 设置过滤器
      result.current.setFilters({ category: 'milestone' })
      expect(result.current.filters.category).toBe('milestone')

      // 重置过滤器
      await result.current.resetFilters()
      expect(result.current.filters).toEqual({})
    })

    it('应该清除错误', () => {
      const { result } = renderHook(() => useGrowthRecords(childId))

      result.current.error = '测试错误'
      result.current.clearError()

      expect(result.current.error).toBe(null)
    })
  })
})

describe('useGrowthCategories', () => {
  it('应该返回正确的成长类别', () => {
    const categories = useGrowthCategories()

    expect(categories).toHaveProperty('milestone')
    expect(categories).toHaveProperty('daily')
    expect(categories).toHaveProperty('achievement')

    expect(categories.milestone).toMatchObject({
      name: '里程碑',
      color: 'blue',
      icon: '🏆',
    })
  })
})

describe('useGrowthRecordStats', () => {
  const childId = 'child-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该获取成长记录统计数据', async () => {
    const mockStats = {
      period: '12m',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      child: {
        id: childId,
        name: 'Test Child',
        birthDate: '2020-01-01',
      },
      summary: {
        totalRecords: 50,
        milestoneRecords: 10,
        dailyRecords: 20,
        achievementRecords: 5,
        healthRecords: 5,
        educationRecords: 5,
        socialRecords: 5,
        activeDays: 30,
        publicRecords: 20,
        averagePerMonth: '4.17',
      },
      monthlyStats: [
        { month: '2024-01', recordsCount: 5 },
        { month: '2024-02', recordsCount: 4 },
      ],
      topTags: [
        { tag: '阅读', usageCount: 10 },
        { tag: '运动', usageCount: 8 },
      ],
    }

    mockApiClient.getGrowthStats.mockResolvedValue({
      success: true,
      data: mockStats,
    })

    const { result } = renderHook(() => useGrowthRecordStats(childId))

    await waitFor(() => {
      expect(result.current.stats).toEqual(mockStats)
      expect(result.current.isLoading).toBe(false)
    })

    expect(apiClient.getGrowthStats).toHaveBeenCalledWith(childId, '7d')
  })
})
