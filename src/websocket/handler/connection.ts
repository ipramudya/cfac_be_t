import { logger } from '@/lib'
import { onMessage } from './message'

export function onConnection(socket: AuthenticatedSocket) {
  logger.debug('New connection:', { user: socket.request.auth })

  socket.on('message', onMessage(socket))
}
