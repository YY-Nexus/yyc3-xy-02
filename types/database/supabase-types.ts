export interface AuthSignUpOptions {
  emailRedirectTo?: string
  data?: Record<string, unknown>
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role?: string
  created_at?: string
}

export interface AuthSession {
  access_token: string
  refresh_token?: string
  user: AuthUser
  expires_at?: number
}

export interface AuthResponse {
  user: AuthUser
  session: AuthSession
}

export interface AuthUpdateAttributes {
  email?: string
  password?: string
  data?: Record<string, unknown>
  email_confirm?: boolean
}

export interface RealtimeChannel {
  on(event: string, callback: (...args: unknown[]) => void): RealtimeChannel
  subscribe(): RealtimeChannel
  unsubscribe(): void
  send(event: string, payload?: unknown): RealtimeChannel
}

export interface QueryFilter {
  column: string
  operator: string
  value: unknown
}

export type QueryOperator = 
  | 'eq' 
  | 'neq' 
  | 'gt' 
  | 'gte' 
  | 'lt' 
  | 'lte' 
  | 'like' 
  | 'ilike' 
  | 'is' 
  | 'in' 
  | 'cs' 
  | 'cd' 
  | 'sl' 
  | 'sr' 
  | 'nxl' 
  | 'nxr' 
  | 'adj' 
  | 'ov' 
  | 'fts' 
  | 'plfts' 
  | 'phfts' 
  | 'wfts'
