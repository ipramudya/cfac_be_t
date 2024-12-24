import { ChatModel } from './schema'
import type { ChatMessage } from './types'

export async function getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
  const chat = await ChatModel.findOne({ userId }, { messages: { $slice: -limit } }).lean()
  return chat?.messages || []
}

export async function addMessage(
  userId: string,
  message: Omit<ChatMessage, 'timestamp'>,
): Promise<void> {
  await ChatModel.updateOne(
    { userId },
    {
      $push: {
        messages: {
          ...message,
          timestamp: new Date(),
        },
      },
      $set: { lastInteraction: new Date() },
    },
    { upsert: true },
  )
}

export async function getContextMessages(
  userId: string,
  contextId: string,
): Promise<ChatMessage[]> {
  const chat = await ChatModel.findOne(
    { userId, 'messages.contextId': contextId },
    { 'messages.$': 1 },
  ).lean()
  return chat?.messages || []
}

export async function clearOldMessages(userId: string, beforeDate: Date): Promise<void> {
  await ChatModel.updateOne(
    { userId },
    {
      $pull: {
        messages: {
          timestamp: { $lt: beforeDate },
        },
      },
    },
  )
}

export async function addMessages(userId: string, messages: ChatMessage[]): Promise<void> {
  await ChatModel.updateOne(
    { userId },
    {
      $push: {
        messages: {
          $each: messages,
        },
      },
      $set: { lastInteraction: new Date() },
    },
    { upsert: true },
  )
}

export async function deleteAllChatHistory(userId: string): Promise<void> {
  await ChatModel.deleteMany({ userId })
}
