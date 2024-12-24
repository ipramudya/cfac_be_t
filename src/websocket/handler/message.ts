import { processExternalApi } from '@/external/services/service'
import { logger } from '@/lib'
import { LLMResponse, processApiResponse, processMessage } from '@/lib/llm'
import type { ChatMessage } from '@/lib/nosql/types'
import { getChatCache, setChatCache } from '@/lib/redis/methods'
import { validateMessagePayload } from '@/websocket/utils'
import io from 'socket.io'
import { v4 as uuid } from 'uuid'

type IsAcceptedCallback = (accepted: boolean) => void

export function onMessage(socket: io.Socket) {
  const userId = socket.handshake.auth.userId

  return async function (payload: unknown, callback: IsAcceptedCallback) {
    callback(true) // Acknowledge receipt of the message immediately

    try {
      const message = validateMessagePayload(payload)
      await handleUserMessage({ socket, userId, text: message.text, timestamp: message.timestamp })
    } catch (error) {
      logger.error('Message handling failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      })
      socket.emit('error', 'Failed to process message')
    }
  }
}

async function handleUserMessage({
  socket,
  text,
  timestamp,
  userId,
}: {
  socket: io.Socket
  text: string
  timestamp: string
  userId: string
}) {
  const userMessage = createMessage({ text, role: 'user', contextId: uuid(), timestamp })
  const chatHistory = await saveMessage(userId, userMessage)

  const llmResponse = await processMessage(chatHistory)

  if (llmResponse.needsMoreInfo && llmResponse.followUpQuestion) {
    return await handleFollowUpQuestion(socket, userId, chatHistory, llmResponse)
  }

  return await handleApiRequest(socket, userId, chatHistory, llmResponse)
}

function createMessage({
  contextId,
  role,
  text,
  timestamp,
  metadata,
}: {
  text: string
  timestamp?: string
  role: 'user' | 'assistant'
  contextId: string
  metadata?: Record<string, any>
}): ChatMessage {
  return {
    text,
    role,
    contextId,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    metadata,
  }
}

async function saveMessage(userId: string, message: ChatMessage): Promise<ChatMessage[]> {
  const history = (await getChatCache(userId)) || []
  const updatedHistory = [...history, message]
  await setChatCache(userId, updatedHistory)
  return updatedHistory
}

async function handleFollowUpQuestion(
  socket: io.Socket,
  userId: string,
  history: ChatMessage[],
  llmResponse: LLMResponse,
) {
  if (!llmResponse.followUpQuestion) {
    logger.error('Missing follow-up question in LLM response')
    socket.emit('error', 'Failed to process request')
    return
  }

  const assistantMessage = createMessage({
    text: llmResponse.followUpQuestion,
    role: 'assistant',
    contextId: history[history.length - 1].contextId,
    metadata: {
      type: llmResponse.type,
      data: llmResponse.params,
    },
  })

  await saveMessage(userId, assistantMessage)
  socket.emit('message', assistantMessage)
}

async function handleApiRequest(
  socket: io.Socket,
  userId: string,
  history: ChatMessage[],
  llmResponse: LLMResponse,
) {
  try {
    socket.emit('processing', {
      type: llmResponse.type,
      params: llmResponse.params,
    })

    const apiResponse = await processExternalApi(llmResponse)
    const naturalResponse = await processApiResponse(apiResponse, llmResponse.type)

    const assistantMessage = createMessage({
      text: naturalResponse.text,
      role: 'assistant',
      contextId: history[history.length - 1].contextId,
      metadata: {
        type: llmResponse.type,
        data: apiResponse.metadata?.data,
      },
    })

    await saveMessage(userId, assistantMessage)
    socket.emit('message', assistantMessage)
  } catch (error) {
    logger.error('API request failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      type: llmResponse.type,
    })
    socket.emit('error', 'Failed to process request')
  }
}
