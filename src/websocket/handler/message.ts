import { logger } from '@/lib'

export function onMessage(socket: AuthenticatedSocket) {
  return function (message: string) {
    const userId = socket.request.auth!.userId

    try {
      logger.info('New message from user', { info: { userId, message } })
    } catch (error) {
      logger.error('Error handling message:', error)
      socket.emit('error', 'Failed to process message')
    }
  }
}
