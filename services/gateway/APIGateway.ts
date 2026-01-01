/**
 * YYC³ 智能预测系统 - API网关
 * 统一管理微服务架构的API路由、负载均衡和请求处理
 */

import { Bun } from 'bun'
import { EventEmitter } from 'events'
import type {
  GatewayConfig,
  RouteDefinition,
  ServiceDefinition,
  RequestMetadata,
  ResponseMetadata,
  LoadBalancingStrategy,
  HealthCheck,
  CircuitBreaker,
  RateLimit,
  AuthenticationConfig,
  Metrics,
  ServiceDiscovery
} from '../types/gateway/common'

/**
 * API网关核心
 * 提供统一的API入口和服务路由管理
 */
export class APIGateway extends EventEmitter {
  private config: GatewayConfig
  private routes: Map<string, RouteDefinition> = new Map()
  private services: Map<string, ServiceDefinition> = new Map()
  private serviceRegistry: ServiceDiscovery
  private loadBalancer: LoadBalancer
  private circuitBreaker: CircuitBreakerManager
  private rateLimiter: RateLimiter
  private authenticator: Authenticator
  private metrics: Metrics
  private isInitialized = false

  constructor(config: GatewayConfig) {
    super()
    this.config = {
      port: process.env.API_GATEWAY_PORT || 1229,
      host: 'localhost',
      maxConnections: 1000,
      requestTimeout: 30000,
      enableMetrics: true,
      enableCircuitBreaker: true,
      enableRateLimit: true,
      enableAuth: true,
      healthCheckInterval: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      loadBalancingStrategy: 'round_robin',
      ...config
    }

    this.serviceRegistry = new ServiceDiscovery()
    this.loadBalancer = new LoadBalancer(this.config.loadBalancingStrategy!)
    this.circuitBreaker = new CircuitBreakerManager()
    this.rateLimiter = new RateLimiter()
    this.authenticator = new Authenticator(this.config.authentication!)
    this.metrics = new Metrics()
  }

  /**
   * 初始化API网关
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      console.log('🚪 初始化API网关...')

      // 发现服务
      await this.discoverServices()

      // 初始化路由
      await this.initializeRoutes()

      // 启动健康检查
      this.startHealthChecks()

      // 启动服务
      await this.startServer()

      this.isInitialized = true
      console.log(`✅ API网关已启动在 http://${this.config.host}:${this.config.port}`)
      this.emit('initialized')

    } catch (error) {
      console.error('❌ API网关初始化失败:', error)
      this.emit('initializationError', error)
      throw error
    }
  }

  /**
   * 注册服务
   */
  async registerService(service: ServiceDefinition): Promise<void> {
    try {
      // 验证服务定义
      await this.validateService(service)

      // 注册到服务发现
      await this.serviceRegistry.register(service)

      // 存储服务定义
      this.services.set(service.id, service)

      // 初始化熔断器
      if (this.config.enableCircuitBreaker) {
        await this.circuitBreaker.registerService(service.id)
      }

      // 初始化速率限制
      if (this.config.enableRateLimit) {
        await this.rateLimiter.registerService(service.id, service.rateLimit)
      }

      this.emit('serviceRegistered', { service })
      console.log(`✅ 服务 "${service.name}" 注册成功`)

    } catch (error) {
      this.emit('serviceRegistrationError', { service, error })
      throw error
    }
  }

  /**
   * 注销服务
   */
  async unregisterService(serviceId: string): Promise<void> {
    try {
      const service = this.services.get(serviceId)
      if (!service) {
        throw new Error(`服务 "${serviceId}" 不存在`)
      }

      // 从服务发现中移除
      await this.serviceRegistry.unregister(serviceId)

      // 从存储中移除
      this.services.delete(serviceId)

      // 清理熔断器
      if (this.config.enableCircuitBreaker) {
        await this.circuitBreaker.unregisterService(serviceId)
      }

      this.emit('serviceUnregistered', { serviceId, service })
      console.log(`✅ 服务 "${service.name}" 注销成功`)

    } catch (error) {
      this.emit('serviceUnregistrationError', { serviceId, error })
      throw error
    }
  }

  /**
   * 添加路由
   */
  async addRoute(route: RouteDefinition): Promise<void> {
    try {
      // 验证路由定义
      await this.validateRoute(route)

      // 存储路由
      this.routes.set(route.path, route)

      this.emit('routeAdded', { route })
      console.log(`✅ 路由 "${route.path}" 添加成功`)

    } catch (error) {
      this.emit('routeAdditionError', { route, error })
      throw error
    }
  }

  /**
   * 移除路由
   */
  async removeRoute(path: string): Promise<void> {
    try {
      if (!this.routes.has(path)) {
        throw new Error(`路由 "${path}" 不存在`)
      }

      this.routes.delete(path)
      this.emit('routeRemoved', { path })
      console.log(`✅ 路由 "${path}" 移除成功`)

    } catch (error) {
      this.emit('routeRemovalError', { path, error })
      throw error
    }
  }

  /**
   * 获取服务列表
   */
  getServices(): ServiceDefinition[] {
    return Array.from(this.services.values())
  }

  /**
   * 获取路由列表
   */
  getRoutes(): RouteDefinition[] {
    return Array.from(this.routes.values())
  }

  /**
   * 获取服务健康状态
   */
  async getServiceHealth(): Promise<Record<string, HealthCheck>> {
    const healthStatus: Record<string, HealthCheck> = {}

    for (const [serviceId, service] of this.services) {
      try {
        const health = await this.checkServiceHealth(service)
        healthStatus[serviceId] = health
      } catch (error) {
        healthStatus[serviceId] = {
          serviceId,
          status: 'unhealthy',
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : String(error)
        }
      }
    }

    return healthStatus
  }

  /**
   * 获取指标
   */
  getMetrics(): Metrics {
    return this.metrics
  }

  /**
   * 关闭API网关
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) return

    try {
      console.log('🛑 关闭API网关...')

      // 停止健康检查
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval)
      }

      // 停止服务器
      if (this.server) {
        this.server.stop()
      }

      // 清理资源
      this.routes.clear()
      this.services.clear()
      await this.serviceRegistry.cleanup()

      this.isInitialized = false
      console.log('✅ API网关已关闭')
      this.emit('shutdown')

    } catch (error) {
      console.error('❌ 关闭API网关时出错:', error)
      throw error
    }
  }

  // 私有方法实现
  private async discoverServices(): Promise<void> {
    console.log('🔍 发现微服务...')

    // 自动发现环境中的服务
    const discoveredServices = await this.serviceRegistry.discover()

    for (const service of discoveredServices) {
      await this.registerService(service)
    }
  }

  private async initializeRoutes(): Promise<void> {
    console.log('🛣️ 初始化路由...')

    // 添加默认路由
    await this.addDefaultRoutes()

    // 为每个服务自动生成路由
    for (const service of this.services.values()) {
      await this.generateServiceRoutes(service)
    }
  }

  private async addDefaultRoutes(): Promise<void> {
    const defaultRoutes: RouteDefinition[] = [
      {
        path: '/health',
        method: 'GET',
        serviceId: 'gateway',
        handler: this.handleHealthCheck.bind(this),
        middleware: [],
        timeout: 5000
      },
      {
        path: '/metrics',
        method: 'GET',
        serviceId: 'gateway',
        handler: this.handleMetrics.bind(this),
        middleware: [],
        timeout: 5000
      },
      {
        path: '/services',
        method: 'GET',
        serviceId: 'gateway',
        handler: this.handleServices.bind(this),
        middleware: [],
        timeout: 5000
      }
    ]

    for (const route of defaultRoutes) {
      await this.addRoute(route)
    }
  }

  private async generateServiceRoutes(service: ServiceDefinition): Promise<void> {
    // 为服务生成RESTful路由
    const basePath = service.basePath || `/api/${service.name.toLowerCase()}`

    const serviceRoutes: RouteDefinition[] = [
      {
        path: `${basePath}/*`,
        method: 'ALL',
        serviceId: service.id,
        handler: this.handleServiceRequest.bind(this, service.id),
        middleware: this.getServiceMiddleware(service),
        timeout: service.timeout || this.config.requestTimeout
      }
    ]

    for (const route of serviceRoutes) {
      await this.addRoute(route)
    }
  }

  private getServiceMiddleware(service: ServiceDefinition): Array<string> {
    const middleware: string[] = []

    if (service.authentication) {
      middleware.push('authentication')
    }

    if (service.rateLimit) {
      middleware.push('rateLimit')
    }

    if (service.circuitBreaker) {
      middleware.push('circuitBreaker')
    }

    return middleware
  }

  private startHealthChecks(): void {
    if (this.config.healthCheckInterval > 0) {
      this.healthCheckInterval = setInterval(async () => {
        await this.performHealthChecks()
      }, this.config.healthCheckInterval)
    }
  }

  private async performHealthChecks(): Promise<void> {
    const healthStatus = await this.getServiceHealth()

    for (const [serviceId, health] of Object.entries(healthStatus)) {
      if (health.status === 'unhealthy') {
        this.emit('serviceUnhealthy', { serviceId, health })
      }
    }
  }

  private async startServer(): Promise<void> {
    const routes: Record<string, any> = {}

    // 注册所有路由
    for (const [path, route] of this.routes) {
      routes[path] = {
        [route.method]: this.createRouteHandler(route)
      }
    }

    // 创建服务器
    this.server = Bun.serve({
      port: this.config.port,
      hostname: this.config.host,
      routes,
      error: this.handleError.bind(this),
      development: {
        hmr: true,
        console: true
      }
    })
  }

  private createRouteHandler(route: RouteDefinition): any {
    return async (request: Request): Promise<Response> => {
      const startTime = Date.now()
      const requestId = this.generateRequestId()

      try {
        // 创建请求元数据
        const metadata: RequestMetadata = {
          requestId,
          path: new URL(request.url).pathname,
          method: request.method,
          startTime,
          userAgent: request.headers.get('user-agent') || '',
          ip: this.getClientIP(request),
          headers: Object.fromEntries(request.headers.entries())
        }

        // 记录请求指标
        this.metrics.recordRequest(metadata)

        // 执行中间件
        await this.executeMiddleware(route.middleware || [], request, metadata)

        // 检查速率限制
        if (this.config.enableRateLimit) {
          const rateLimitResult = await this.rateLimiter.checkLimit(
            metadata.ip,
            route.serviceId
          )
          if (!rateLimitResult.allowed) {
            return this.createRateLimitResponse(rateLimitResult)
          }
        }

        // 执行路由处理器
        const response = await route.handler(request, metadata)

        // 创建响应元数据
        const responseMetadata: ResponseMetadata = {
          requestId,
          duration: Date.now() - startTime,
          statusCode: response.status,
          serviceId: route.serviceId,
          cacheHit: false,
          error: null
        }

        // 记录响应指标
        this.metrics.recordResponse(responseMetadata)

        return response

      } catch (error) {
        const responseMetadata: ResponseMetadata = {
          requestId,
          duration: Date.now() - startTime,
          statusCode: 500,
          serviceId: route.serviceId,
          cacheHit: false,
          error: error instanceof Error ? error.message : String(error)
        }

        this.metrics.recordResponse(responseMetadata)
        this.emit('requestError', { metadata, error })

        return this.createErrorResponse(error)
      }
    }
  }

  private async executeMiddleware(
    middleware: string[],
    request: Request,
    metadata: RequestMetadata
  ): Promise<void> {
    for (const middlewareName of middleware) {
      switch (middlewareName) {
        case 'authentication':
          if (this.config.enableAuth) {
            await this.authenticator.authenticate(request, metadata)
          }
          break

        case 'rateLimit':
          if (this.config.enableRateLimit) {
            const rateLimitResult = await this.rateLimiter.checkLimit(
              metadata.ip,
              metadata.path
            )
            if (!rateLimitResult.allowed) {
              throw new Error('Rate limit exceeded')
            }
          }
          break

        case 'circuitBreaker':
          if (this.config.enableCircuitBreaker) {
            // 熔断器检查在服务调用时执行
          }
          break
      }
    }
  }

  private async handleServiceRequest(
    serviceId: string,
    request: Request,
    metadata: RequestMetadata
  ): Promise<Response> {
    const service = this.services.get(serviceId)
    if (!service) {
      throw new Error(`服务 "${serviceId}" 不存在`)
    }

    // 检查熔断器状态
    if (this.config.enableCircuitBreaker) {
      const circuitState = await this.circuitBreaker.getState(serviceId)
      if (circuitState.state === 'open') {
        return this.createCircuitBreakerResponse(circuitState)
      }
    }

    // 获取服务实例
    const instance = await this.loadBalancer.selectInstance(service)
    if (!instance) {
      throw new Error(`服务 "${serviceId}" 没有可用实例`)
    }

    // 转发请求
    const response = await this.forwardRequest(request, instance)

    // 更新熔断器状态
    if (this.config.enableCircuitBreaker) {
      await this.circuitBreaker.recordSuccess(serviceId)
    }

    return response
  }

  private async forwardRequest(
    request: Request,
    instance: any
  ): Promise<Response> {
    const url = new URL(request.url)
    const targetUrl = `${instance.protocol}://${instance.host}:${instance.port}${url.pathname}${url.search}`

    // 转发请求头
    const headers = new Headers()
    for (const [key, value] of request.headers.entries()) {
      headers.set(key, value)
    }

    // 更新Host头
    headers.set('Host', `${instance.host}:${instance.port}`)

    // 转发请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      signal: AbortSignal.timeout(this.config.requestTimeout!)
    })

    return response
  }

  private async handleHealthCheck(request: Request, metadata: RequestMetadata): Promise<Response> {
    const health = await this.getServiceHealth()

    return Response.json({
      status: 'healthy',
      timestamp: new Date(),
      services: health,
      gateway: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
      }
    })
  }

  private async handleMetrics(request: Request, metadata: RequestMetadata): Promise<Response> {
    const metrics = this.getMetrics()

    return Response.json({
      metrics,
      timestamp: new Date()
    })
  }

  private async handleServices(request: Request, metadata: RequestMetadata): Promise<Response> {
    const services = this.getServices()

    return Response.json({
      services,
      total: services.length,
      timestamp: new Date()
    })
  }

  private createRateLimitResponse(rateLimitResult: any): Response {
    return Response.json({
      error: 'Rate limit exceeded',
      retryAfter: rateLimitResult.retryAfter
    }, { status: 429 })
  }

  private createCircuitBreakerResponse(circuitState: any): Response {
    return Response.json({
      error: 'Service temporarily unavailable',
      state: circuitState.state
    }, { status: 503 })
  }

  private createErrorResponse(error: any): Response {
    return Response.json({
      error: 'Internal server error',
      message: error.message || 'Unknown error',
      timestamp: new Date()
    }, { status: 500 })
  }

  private handleError(error: Error): Response {
    console.error('Gateway error:', error)
    return this.createErrorResponse(error)
  }

  private async checkServiceHealth(service: ServiceDefinition): Promise<HealthCheck> {
    try {
      const healthUrl = `${service.protocol}://${service.host}:${service.port}/health`
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })

      return {
        serviceId: service.id,
        status: response.ok ? 'healthy' : 'unhealthy',
        lastCheck: new Date(),
        responseTime: 0, // 可以计算实际响应时间
        details: response.ok ? undefined : `HTTP ${response.status}`
      }
    } catch (error) {
      return {
        serviceId: service.id,
        status: 'unhealthy',
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getClientIP(request: Request): string {
    return request.headers.get('x-forwarded-for') ||
           request.headers.get('x-real-ip') ||
           'unknown'
  }

  private async validateService(service: ServiceDefinition): Promise<void> {
    if (!service.id || !service.name || !service.host || !service.port) {
      throw new Error('服务定义缺少必需字段')
    }
  }

  private async validateRoute(route: RouteDefinition): Promise<void> {
    if (!route.path || !route.method || !route.serviceId) {
      throw new Error('路由定义缺少必需字段')
    }
  }

  private server?: any
  private healthCheckInterval?: NodeJS.Timeout
}

// 辅助类实现
class ServiceDiscovery {
  private services: Map<string, ServiceDefinition> = new Map()

  async register(service: ServiceDefinition): Promise<void> {
    this.services.set(service.id, service)
  }

  async unregister(serviceId: string): Promise<void> {
    this.services.delete(serviceId)
  }

  async discover(): Promise<ServiceDefinition[]> {
    // 这里可以实现服务发现逻辑
    return []
  }

  async getService(serviceId: string): Promise<ServiceDefinition | undefined> {
    return this.services.get(serviceId)
  }

  async cleanup(): Promise<void> {
    this.services.clear()
  }
}

class LoadBalancer {
  constructor(private strategy: LoadBalancingStrategy) {}

  async selectInstance(service: ServiceDefinition): Promise<any> {
    // 简化的负载均衡实现
    return {
      protocol: service.protocol || 'http',
      host: service.host,
      port: service.port,
      weight: 1
    }
  }
}

class CircuitBreakerManager {
  private breakers: Map<string, CircuitBreaker> = new Map()

  async registerService(serviceId: string): Promise<void> {
    this.breakers.set(serviceId, {
      serviceId,
      state: 'closed',
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      timeout: 60000,
      threshold: 5
    })
  }

  async unregisterService(serviceId: string): Promise<void> {
    this.breakers.delete(serviceId)
  }

  async getState(serviceId: string): Promise<CircuitBreaker> {
    return this.breakers.get(serviceId) || {
      serviceId,
      state: 'closed',
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null
    }
  }

  async recordSuccess(serviceId: string): Promise<void> {
    const breaker = this.breakers.get(serviceId)
    if (breaker) {
      breaker.successCount++
      breaker.failureCount = Math.max(0, breaker.failureCount - 1)
      if (breaker.state === 'half_open') {
        breaker.state = 'closed'
      }
    }
  }

  async recordFailure(serviceId: string): Promise<void> {
    const breaker = this.breakers.get(serviceId)
    if (breaker) {
      breaker.failureCount++
      breaker.lastFailureTime = new Date()
      if (breaker.failureCount >= breaker.threshold) {
        breaker.state = 'open'
      }
    }
  }
}

class RateLimiter {
  private limits: Map<string, RateLimit> = new Map()

  async registerService(serviceId: string, rateLimit?: RateLimit): Promise<void> {
    if (rateLimit) {
      this.limits.set(serviceId, rateLimit)
    }
  }

  async checkLimit(identifier: string, serviceId?: string): Promise<{
    allowed: boolean
    retryAfter?: number
  }> {
    // 简化的速率限制实现
    return { allowed: true }
  }
}

class Authenticator {
  constructor(private config: AuthenticationConfig) {}

  async authenticate(request: Request, metadata: RequestMetadata): Promise<void> {
    // 简化的认证实现
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }
  }
}

class Metrics {
  private requestCount = 0
  private responseCount = 0
  private errorCount = 0
  private responseTimeSum = 0

  recordRequest(metadata: RequestMetadata): void {
    this.requestCount++
  }

  recordResponse(metadata: ResponseMetadata): void {
    this.responseCount++
    this.responseTimeSum += metadata.duration
    if (metadata.statusCode >= 400) {
      this.errorCount++
    }
  }

  getSummary() {
    return {
      requests: this.requestCount,
      responses: this.responseCount,
      errors: this.errorCount,
      averageResponseTime: this.responseCount > 0 ? this.responseTimeSum / this.responseCount : 0
    }
  }
}