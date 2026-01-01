/**
 * @file 动画系统类型定义
 * @description 动画系统相关的类型定义
 * @author YYC³ Development Team
 * @version 1.0.0
 * @created 2024-12-31
 */

import { Transition, Variant, Variants } from 'framer-motion'

export type AnimationState = {
  opacity?: number
  x?: number | string
  y?: number | string
  scale?: number
  rotate?: number
  pathLength?: number
  boxShadow?: string
  [key: string]: number | string | undefined
}

export interface AnimationConfig {
  hidden?: Variant
  visible?: Variant
  exit?: Variant
  hover?: Variant
  tap?: Variant
  transition?: Transition
}

export interface ResponsiveBreakpoints {
  mobile?: Variant
  tablet?: Variant
  desktop?: Variant
}

export interface BatchAnimationItem {
  animation: () => Variant
  delay?: number
}
