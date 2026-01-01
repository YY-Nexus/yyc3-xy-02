/**
 * YYC³ AI小语智能成长守护系统 - AI聊天Hook测试
 * Phase 1 Week 5-6: 聊天功能测试
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useAIChat, useAIRoleConfig, useEmotionAnalysis } from '@/hooks/useAIChat'

// Mock API client
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    getAIRoles: jest.fn(),
    getConversationHistory: jest.fn(),
    getAISessions: jest.fn(),
    chat: jest.fn(),
    getChatStats: jest.fn(),
  },
}))

import { apiClient } from '@/lib/api/client'

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('useAIChat Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('初始化测试', () => {
    it('应该初始化正确的默认值', () => {
      const { result } = renderHook(() => useAIChat())

      expect(result.current.messages).toEqual([])
      expect(result.current.sessions).toEqual([])
      expect(result.current.aiRoles).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.currentSessionId).toBe(null)
    })

    it('应该在挂载时加载AI角色', async () => {
      const mockRoles = [
        { id: '1', name: '记录者', description: '记录成长瞬间', personality: '温暖', capabilities: [], isActive: true },
        { id: '2', name: '守护者', description: '保护安全', personality: '严谨', capabilities: [], isActive: true },
      ]

      mockApiClient.getAIRoles.mockResolvedValue({
        success: true,
        data: { aiRoles: mockRoles }
      })

      const { result } = renderHook(() => useAIChat())

      await waitFor(() => {
        expect(result.current.aiRoles).toEqual(mockRoles)
      })
      expect(mockApiClient.getAIRoles).toHaveBeenCalledTimes(1)
    })
  })

  describe('会话管理', () => {
    it('应该加载会话列表', async () => {
      const mockSessions = [
        { sessionId: 'session1', lastMessageAt: '2023-12-01', messageCount: 5, lastMessage: '你好' },
        { sessionId: 'session2', lastMessageAt: '2023-12-02', messageCount: 3, lastMessage: '再见' },
      ]

      mockApiClient.getAISessions.mockResolvedValue({
        success: true,
        data: { 
          child: { id: 'child1', name: '测试儿童' },
          sessions: mockSessions 
        }
      })

      const { result } = renderHook(() => useAIChat())

      await waitFor(() => {
        result.current.loadSessions('child1')
      })

      await waitFor(() => {
        expect(result.current.sessions).toEqual(mockSessions)
      })
      expect(mockApiClient.getAISessions).toHaveBeenCalledWith('child1')
    })

    it('应该创建新会话', () => {
      const { result } = renderHook(() => useAIChat())

      const newSessionId = result.current.createNewSession()

      expect(newSessionId).toMatch(/session_\d+_[a-z0-9]+/)
      expect(result.current.currentSessionId).toBe(newSessionId)
      expect(result.current.messages).toEqual([])
    })

    it('应该设置当前会话ID', () => {
      const { result } = renderHook(() => useAIChat())

      result.current.setCurrentSessionId('test-session')

      expect(result.current.currentSessionId).toBe('test-session')
    })
  })

  describe('消息管理', () => {
    it('应该加载对话历史', async () => {
      const mockMessages = [
        {
          id: 'msg1',
          sessionId: 'session1',
          userMessage: '你好',
          aiResponse: '你好呀！',
          aiRole: 'recorder' as const,
          aiRoleName: '记录者',
          emotion: 'happy',
          createdAt: '2023-12-01',
        },
      ]

      mockApiClient.getConversationHistory.mockResolvedValue({
        success: true,
        data: { 
          conversations: mockMessages,
          pagination: { page: 1, limit: 50, total: 1, pages: 1 }
        }
      })

      const { result } = renderHook(() => useAIChat())

      await waitFor(() => {
        result.current.loadConversationHistory('child1', 'session1')
      })

      await waitFor(() => {
        expect(result.current.messages).toEqual(mockMessages)
        expect(result.current.isLoading).toBe(false)
      })
      expect(mockApiClient.getConversationHistory).toHaveBeenCalledWith('child1', {
        page: 1,
        limit: 50,
        sessionId: 'session1',
      })
    })

    it('应该发送消息并更新状态', async () => {
      const mockResponse = {
        success: true,
        data: {
          sessionId: 'session1',
          message: '你好',
          aiResponse: '你好呀！',
          aiRole: 'recorder' as const,
          aiRoleName: '记录者',
          emotion: 'happy',
          context: {},
        },
      }

      mockApiClient.chat.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAIChat())

      const success = await result.current.sendMessage('你好', 'recorder', 'child1', 'session1')

      expect(success).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(mockApiClient.chat).toHaveBeenCalledWith({
        childId: 'child1',
        message: '你好',
        aiRole: 'recorder',
        sessionId: 'session1',
      })
    })

    it('发送消息失败时应该设置错误信息', async () => {
      mockApiClient.chat.mockResolvedValue({
        success: false,
        error: '发送失败',
      })

      const { result } = renderHook(() => useAIChat())

      const success = await result.current.sendMessage('你好', 'recorder', 'child1', 'session1')

      expect(success).toBe(false)
      expect(result.current.error).toBe('发送失败')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('错误处理', () => {
    it('应该清除错误信息', () => {
      const { result } = renderHook(() => useAIChat())

      // 通过模拟 API 调用间接设置错误
      mockApiClient.getConversationHistory.mockRejectedValue(new Error('测试错误'))
      
      // 调用会产生错误的方法
      result.current.loadConversationHistory('child1', 'session1')

      // 清除错误
      result.current.clearError()

      expect(result.current.error).toBe(null)
    })

    it('加载对话历史失败时应该设置错误', async () => {
      mockApiClient.getConversationHistory.mockRejectedValue(new Error('加载失败'))

      const { result } = renderHook(() => useAIChat())

      await waitFor(() => {
        result.current.loadConversationHistory('child1', 'session1')
      })

      await waitFor(() => {
        expect(result.current.error).toBe('加载对话历史失败')
        expect(result.current.isLoading).toBe(false)
      })
    })
  })
})

describe('useAIRoleConfig Hook', () => {
  it('应该返回正确的AI角色配置', () => {
    const { result } = renderHook(() => useAIRoleConfig())

    expect(result.current).toHaveProperty('recorder')
    expect(result.current).toHaveProperty('guardian')
    expect(result.current).toHaveProperty('listener')
    expect(result.current).toHaveProperty('advisor')
    expect(result.current).toHaveProperty('cultural_mentor')

    // 验证记录者角色配置
    expect(result.current.recorder.name).toBe('记录者')
    expect(result.current.recorder.icon).toBe('📝')

    // 验证守护者角色配置
    expect(result.current.guardian.name).toBe('守护者')
    expect(result.current.guardian.icon).toBe('🛡️')
  })
})

describe('useEmotionAnalysis Hook', () => {
  it('应该初始化正确的默认值', () => {
    const { result } = renderHook(() => useEmotionAnalysis())

    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.emotion).toBe(null)
  })

  it('应该正确分析积极情绪文本', async () => {
    const { result } = renderHook(() => useEmotionAnalysis())

    const emotion = await result.current.analyzeEmotion('今天我很开心')

    expect(emotion).toBe('happy')
    expect(result.current.emotion).toBe('happy')
    expect(result.current.isAnalyzing).toBe(false)
  })

  it('应该正确分析消极情绪文本', async () => {
    const { result } = renderHook(() => useEmotionAnalysis())

    const emotion = await result.current.analyzeEmotion('我感到难过')

    expect(emotion).toBe('sad')
    expect(result.current.emotion).toBe('sad')
    expect(result.current.isAnalyzing).toBe(false)
  })

  it('应该正确分析愤怒情绪文本', async () => {
    const { result } = renderHook(() => useEmotionAnalysis())

    const emotion = await result.current.analyzeEmotion('我很生气')

    expect(emotion).toBe('angry')
    expect(result.current.emotion).toBe('angry')
    expect(result.current.isAnalyzing).toBe(false)
  })

  it('应该正确分析恐惧情绪文本', async () => {
    const { result } = renderHook(() => useEmotionAnalysis())

    const emotion = await result.current.analyzeEmotion('我很害怕')

    expect(emotion).toBe('fear')
    expect(result.current.emotion).toBe('fear')
    expect(result.current.isAnalyzing).toBe(false)
  })

  it('应该返回中性情绪文本', async () => {
    const { result } = renderHook(() => useEmotionAnalysis())

    const emotion = await result.current.analyzeEmotion('今天天气不错')

    expect(emotion).toBe('neutral')
    expect(result.current.emotion).toBe('neutral')
    expect(result.current.isAnalyzing).toBe(false)
  })

  it('应该处理空文本', async () => {
    const { result } = renderHook(() => useEmotionAnalysis())

    const emotion = await result.current.analyzeEmotion('')

    expect(emotion).toBe(null)
    expect(result.current.emotion).toBe(null)
    expect(result.current.isAnalyzing).toBe(false)
  })
})
