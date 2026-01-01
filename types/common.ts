export interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  avatar: string
  name: string
  timestamp: number
}

export interface AIRole {
  id: string
  name: string
  description: string
  avatar: string
  color: string
}
