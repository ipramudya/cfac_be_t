import { logger } from '@/lib'
import { getChatHistory } from '@/lib/nosql/queries'
import { clearChatCache, setChatCache } from '@/lib/redis/methods'
import { onMessage } from './message'
import io from 'socket.io'

export async function onConnection(socket: io.Socket) {
  const userId = socket.handshake.auth.userId
  logger.debug('New connection', { debug: { user: socket.handshake.auth } })

  if (!userId) {
    socket.disconnect()
    return
  }

  await initializeActiveChat(userId)

  socket.on('message', onMessage(socket))

  socket.on('disconnect', async () => {
    await clearChatCache(userId)
  })
}

async function initializeActiveChat(userId: string): Promise<void> {
  try {
    // Pull chat history from MongoDB (if exists)
    const chatHistory = await getChatHistory(userId)

    // Cache chat history when connection starts
    if (chatHistory.length > 0) {
      await setChatCache(userId, chatHistory)
    }
  } catch (error) {
    logger.error('Failed to initialize chat', { error })
  }
}
