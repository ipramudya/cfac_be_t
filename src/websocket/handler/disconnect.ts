import { logger } from '@/lib'
import { addMessages } from '@/lib/nosql/queries'
import { clearChatCache, getChatCache } from '@/lib/redis/methods'
import { JwtPayload } from 'jsonwebtoken'
import io from 'socket.io'

export function onDisconnect(socket: io.Socket) {
  const userId = (socket.handshake.auth as JwtPayload & JwtPayloadData).userId

  return async function (reason: io.DisconnectReason) {
    try {
      // Only store history for normal disconnects
      const isNormalDisconnect = [
        'client namespace disconnect',
        'transport close',
        'ping timeout',
      ].includes(reason)

      if (isNormalDisconnect) {
        const cachedHistory = await getChatCache(userId)

        if (cachedHistory && cachedHistory.length > 0) {
          await addMessages(userId, cachedHistory)
          logger.info('Chat history stored in MongoDB', {
            info: {
              userId,
              messageCount: cachedHistory.length,
              reason,
            },
          })
        }
      } else {
        logger.debug('Skipping chat history storage due to error disconnect', {
          debug: { userId, reason },
        })
      }

      // Always clear the cache
      await clearChatCache(userId)
    } catch (error) {
      logger.error('Failed to handle disconnect', {
        error,
        context: { userId, reason },
      })
    }
  }
}
