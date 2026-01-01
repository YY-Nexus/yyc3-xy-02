/**
 * YYC³ AI小语智能成长守护系统 - 可访问性Hook测试
 * Phase 1 Week 5-6: 可访问性测试
 */

import { renderHook, act } from '@testing-library/react'
import useAccessibility from '@/hooks/useAccessibility'

describe('useAccessibility Hook', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn<string | null, [string]>(() => null),
    setItem: jest.fn(() => {}),
    removeItem: jest.fn(() => {}),
    clear: jest.fn(() => {}),
  }

  // Mock matchMedia
  const matchMediaMock = jest.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(() => {}),
    removeListener: jest.fn(() => {}),
    addEventListener: jest.fn(() => {}),
    removeEventListener: jest.fn(() => {}),
    dispatchEvent: jest.fn(() => {}),
  }))

  beforeEach(() => {
    // 设置mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })

    // 清除所有mock调用历史
    jest.clearAllMocks()
  })

  it('应该初始化正确的默认值', () => {
    const { result } = renderHook(() => useAccessibility())

    expect(result.current.settings).toEqual({
      screenReaderEnabled: false,
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      keyboardNavigation: true,
      focusVisible: true,
      skipLinks: true,
      increasedSpacing: false,
      underlineLinks: true,
      showFocus: true,
      soundEnabled: true,
      visualNotifications: true,
      simpleLanguage: false,
      readingGuide: false,
      showDescriptions: false,
    })
  })

  it('应该从localStorage加载设置', () => {
    const savedSettings = {
      screenReaderEnabled: true,
      highContrast: true,
      fontSize: 'large',
    }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSettings))

    const { result } = renderHook(() => useAccessibility())

    expect(result.current.settings.screenReaderEnabled).toBe(true)
    expect(result.current.settings.highContrast).toBe(true)
    expect(result.current.settings.fontSize).toBe('large')
  })

  it('应该将设置保存到localStorage', () => {
    const { result } = renderHook(() => useAccessibility())

    act(() => {
      result.current.updateSetting('highContrast', true)
    })

    expect(result.current.settings.highContrast).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalled()
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'yyc3-accessibility-settings',
      expect.stringContaining('"highContrast":true')
    )
  })

  it('应该切换高对比度模式', () => {
    const { result } = renderHook(() => useAccessibility())

    expect(result.current.settings.highContrast).toBe(false)

    act(() => {
      result.current.toggleHighContrast()
    })

    expect(result.current.settings.highContrast).toBe(true)

    act(() => {
      result.current.toggleHighContrast()
    })

    expect(result.current.settings.highContrast).toBe(false)
  })

  it('应该切换减少动画模式', () => {
    const { result } = renderHook(() => useAccessibility())

    expect(result.current.settings.reducedMotion).toBe(false)

    act(() => {
      result.current.toggleReducedMotion()
    })

    expect(result.current.settings.reducedMotion).toBe(true)

    act(() => {
      result.current.toggleReducedMotion()
    })

    expect(result.current.settings.reducedMotion).toBe(false)
  })

  it('应该切换屏幕阅读器支持', () => {
    const { result } = renderHook(() => useAccessibility())

    expect(result.current.settings.screenReaderEnabled).toBe(false)

    act(() => {
      result.current.toggleScreenReader()
    })

    expect(result.current.settings.screenReaderEnabled).toBe(true)

    act(() => {
      result.current.toggleScreenReader()
    })

    expect(result.current.settings.screenReaderEnabled).toBe(false)
  })

  it('应该增加字体大小', () => {
    const { result } = renderHook(() => useAccessibility())

    expect(result.current.settings.fontSize).toBe('medium')

    act(() => {
      result.current.increaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('large')

    act(() => {
      result.current.increaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('extra-large')

    // 不能再增加了
    act(() => {
      result.current.increaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('extra-large')
  })

  it('应该减少字体大小', () => {
    const { result } = renderHook(() => useAccessibility())

    // 先增加到最大
    act(() => {
      result.current.increaseFontSize()
      result.current.increaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('extra-large')

    act(() => {
      result.current.decreaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('large')

    act(() => {
      result.current.decreaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('medium')

    act(() => {
      result.current.decreaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('small')

    // 不能再减少了
    act(() => {
      result.current.decreaseFontSize()
    })

    expect(result.current.settings.fontSize).toBe('small')
  })

  it('应该重置所有设置', () => {
    const { result } = renderHook(() => useAccessibility())

    // 修改一些设置
    act(() => {
      result.current.updateSetting('highContrast', true)
      result.current.updateSetting('fontSize', 'large')
      result.current.updateSetting('reducedMotion', true)
    })

    expect(result.current.settings.highContrast).toBe(true)
    expect(result.current.settings.fontSize).toBe('large')
    expect(result.current.settings.reducedMotion).toBe(true)

    // 重置设置
    act(() => {
      result.current.resetSettings()
    })

    // 验证是否恢复默认值
    expect(result.current.settings.highContrast).toBe(false)
    expect(result.current.settings.fontSize).toBe('medium')
    expect(result.current.settings.reducedMotion).toBe(false)
    expect(result.current.settings.keyboardNavigation).toBe(true) // 保持默认值
  })

  it('应该生成可访问性报告', () => {
    const { result } = renderHook(() => useAccessibility())

    // 修改一些设置
    act(() => {
      result.current.updateSetting('highContrast', true)
      result.current.updateSetting('reducedMotion', true)
    })

    const report = result.current.generateAccessibilityReport()

    expect(report).toHaveProperty('totalFeatures')
    expect(report).toHaveProperty('activeFeatures')
    expect(report).toHaveProperty('enabledFeatures')
    expect(report).toHaveProperty('fontSize')
    expect(report).toHaveProperty('timestamp')

    expect(report.enabledFeatures).toContain('高对比度模式')
    expect(report.enabledFeatures).toContain('减少动画')
    expect(report.fontSize).toBe('medium')
  })
})