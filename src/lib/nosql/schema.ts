import type { ChatHistory, ChatMessage, MessageMetadata } from './types'
import mongoose from 'mongoose'

const MessageMetadataSchema = new mongoose.Schema<MessageMetadata>(
  {
    type: {
      type: String,
      enum: ['recipe', 'nutrition', 'ingredient', 'suggestion'],
    },
    data: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
)

const ChatMessageSchema = new mongoose.Schema<ChatMessage>(
  {
    text: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    contextId: {
      type: String,
      required: true,
    },
    metadata: MessageMetadataSchema,
  },
  { _id: false },
)

const ChatSchema = new mongoose.Schema<ChatHistory>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  messages: [ChatMessageSchema],
  lastInteraction: {
    type: Date,
    default: Date.now,
  },
})

ChatSchema.index({ userId: 1, timestamp: -1 })

ChatSchema.pre('save', function (next) {
  this.lastInteraction = new Date()
  next()
})

export const ChatModel = mongoose.model<ChatHistory>('Chat', ChatSchema)
