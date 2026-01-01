/**
 * @file 语音系统类型定义
 * @description 语音系统相关的类型定义
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2024-12-31
 */

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
  error?: string
}

export interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

export interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

export interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

export interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

export interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

declare global {
  interface Window {
    SpeechRecognition?: {
      prototype: SpeechRecognition
      new (): SpeechRecognition
    }
    webkitSpeechRecognition?: {
      prototype: SpeechRecognition
      new (): SpeechRecognition
    }
  }
}
