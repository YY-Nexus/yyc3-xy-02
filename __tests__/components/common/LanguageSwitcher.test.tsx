/**
 * YYC³ AI小语智能成长守护系统 - 语言切换器组件测试
 * 第六阶段：高级特性与生产准备
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { mock, describe, it, expect, beforeEach } from 'bun:test'
// @ts-ignore
import LanguageSwitcher from '@/components/common/LanguageSwitcher'

const mockPush = mock(() => {})
const mockUseRouter = mock(() => ({push: mockPush}))
const mockPathname = '/zh'
const mockUsePathname = mock(() => mockPathname)

// @ts-ignore
global.useRouter = mockUseRouter
// @ts-ignore
global.usePathname = mockUsePathname

const mockUseLocale = mock(() => 'zh')
const mockUseTranslations = mock(() => (key: string) => key)

// @ts-ignore
global.useLocale = mockUseLocale
// @ts-ignore
global.useTranslations = mockUseTranslations

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockUseRouter.mockClear()
    mockUsePathname.mockClear()
    mockPush.mockClear()
  })

  it('renders language switcher button', () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })
    expect(button).toBeInTheDocument()
  })

  it('displays current language correctly', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/zh')
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('中文')
  })

  it('opens dropdown menu when clicked', async () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: '中文' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'English' })).toBeInTheDocument()
    })
  })

  it('switches to English when English is clicked', async () => {
    ;(usePathname as jest.Mock).mockReturnValue('/zh')
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })
    fireEvent.click(button)

    await waitFor(() => {
      const englishOption = screen.getByRole('menuitem', { name: 'English' })
      fireEvent.click(englishOption)
    })

    expect(mockPush).toHaveBeenCalled()
    expect(mockPush.mock.calls.length).toBeGreaterThan(0)
    expect(mockPush.mock.calls[0][0]).toBe('/en')
  })

  it('switches to Chinese when Chinese is clicked', async () => {
    ;(usePathname as jest.Mock).mockReturnValue('/en')
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })
    fireEvent.click(button)

    await waitFor(() => {
      const chineseOption = screen.getByRole('menuitem', { name: '中文' })
      fireEvent.click(chineseOption)
    })

    expect(mockPush).toHaveBeenCalledWith('/zh')
  })

  it('closes dropdown when clicking outside', async () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    // Click outside
    fireEvent.mouseDown(document.body)

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('has correct ARIA attributes', () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('updates ARIA expanded state when menu is open', async () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })

    // Initially closed
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('is accessible via keyboard', async () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })

    // Focus button
    button.focus()
    expect(button).toHaveFocus()

    // Open with Enter key
    fireEvent.keyDown(button, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    // Navigate with arrow keys
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })

    // Select with Enter key
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' })

    expect(mockPush).toHaveBeenCalled()
  })

  it('handles Escape key to close menu', async () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button', { name: /切换语言/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    // Press Escape
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      expect(button).toHaveFocus()
    })
  })
})