import { logger } from '@/lib'
import { processMessage } from '@/lib/llm/message-processor'
import { LLMResponse } from '@/lib/llm/types'
import type { ChatMessage } from '@/lib/nosql/types'
import { getChatCache, setChatCache } from '@/lib/redis/methods'
import { SocketException } from '@/websocket/utils'
import status from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import io from 'socket.io'
import { v4 as uuid } from 'uuid'

export function onMessage(socket: io.Socket) {
  return async function (message: string) {
    const userId = (socket.handshake.auth as JwtPayload & JwtPayloadData).userId

    try {
      logger.info('Processing new message', { info: { userId, message } })

      const cachedMessagesHistory = await cacheIncomingMessage(userId, message)

      const llmResponse = await processMessage(cachedMessagesHistory)

      if (llmResponse.needsMoreInfo && llmResponse.followUpQuestion) {
        await handleFollowUpQuestion(socket, userId, cachedMessagesHistory, llmResponse)
      } else {
        await handleApiProcessing(socket, llmResponse)
      }
    } catch (error) {
      socket.emit('error', error)
    }
  }
}

async function cacheIncomingMessage(userId: string, message: string): Promise<ChatMessage[]> {
  const newMessage: ChatMessage = {
    text: message,
    role: 'user',
    timestamp: new Date(),
    contextId: uuid(),
  }

  const chatHistory = (await getChatCache(userId)) || []
  const updatedHistory = [...chatHistory, newMessage]

  await setChatCache(userId, updatedHistory)

  return updatedHistory
}

async function handleFollowUpQuestion(
  socket: io.Socket,
  userId: string,
  chatHistory: ChatMessage[],
  llmResponse: LLMResponse,
) {
  if (!llmResponse.followUpQuestion) {
    throw new SocketException(
      'Missing follow-up question',
      status.getStatusText(status.BAD_REQUEST),
      { response: llmResponse },
    )
  }

  const assistantMessage: ChatMessage = {
    text: llmResponse.followUpQuestion,
    role: 'assistant',
    timestamp: new Date(),
    contextId: chatHistory[chatHistory.length - 1].contextId,
    metadata: {
      type: llmResponse.type,
      data: llmResponse.params,
    },
  }

  const newHistory = [...chatHistory, assistantMessage]
  await setChatCache(userId, newHistory)

  socket.emit('message', assistantMessage)
}

async function handleApiProcessing(socket: io.Socket, llmResponse: LLMResponse) {
  // Emit processing event before making API call
  socket.emit('processing', {
    type: llmResponse.type,
    params: llmResponse.params,
  })

  // TODO: Implement API call handling
  // This is where you'll add the actual API call logic later
}
