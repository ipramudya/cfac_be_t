import type { Document } from 'mongoose'

export type MessageType = 'recipe' | 'nutrition' | 'ingredient' | 'suggestion'

export type MessageMetadata = {
  type?: MessageType
  data?: Record<string, any>
}

export type ChatMessage = {
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  contextId: string
  metadata?: MessageMetadata
}

export type ChatHistory = {
  userId: string
  messages: ChatMessage[]
  lastInteraction: Date
} & Document
