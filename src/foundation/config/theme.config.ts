// @file src/foundation/config/theme.config.ts
// @description YYC³ 主题配置
// @author YYC³团队
// @version 1.0.0

export const themeConfig = {
  // 主题类型
  type: 'light' as 'light' | 'dark' | 'auto',
  
  // 主色调
  primaryColor: '#3B82F6',
  
  // 辅助色调
  secondaryColor: '#8B5CF6',
  
  // 布局配置
  layout: {
    // 头部高度
    headerHeight: '64px',
    
    // 侧边栏宽度
    sidebarWidth: '256px',
    
    // 内容区域间距
    contentPadding: '24px',
    
    // 最大内容宽度
    maxContentWidth: '1200px',
  },
  
  // 动画配置
  animation: {
    // 过渡时长
    transitionDuration: '0.3s',
    
    // 过渡曲线
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // 是否启用动画
    enabled: true,
  },
  
  // 响应式断点
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // 组件默认配置
  components: {
    button: {
      defaultSize: 'md' as const,
      defaultVariant: 'default' as const,
    },
    input: {
      defaultSize: 'md' as const,
      borderWidth: '1px',
    },
    card: {
      borderRadius: '8px',
      shadow: true,
    },
  },
};
