import type { Document } from 'mongoose'

export type MessageType = 'recipe' | 'random-recipe' | 'nutrition' | 'ingredient'

export type MessageMetadata = {
  type?: MessageType
  data?: Record<string, any>
}

export type ChatMessage = {
  text: string
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
