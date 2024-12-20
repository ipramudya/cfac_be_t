import { ChatMessage } from '../nosql/types'
import { cache } from './cache'

const CHAT_TTL = 3600 // 1 hour

export async function setChatCache(userId: string, messages: ChatMessage[]) {
  await cache.setex(`chat:${userId}`, CHAT_TTL, JSON.stringify(messages))
}

export async function getChatCache(userId: string): Promise<ChatMessage[] | null> {
  const data = await cache.get(`chat:${userId}`)
  return data ? JSON.parse(data) : null
}

export async function clearChatCache(userId: string) {
  await cache.del(`chat:${userId}`)
}
