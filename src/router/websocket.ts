import { logger } from '@/lib'
import { DefaultEventsMap, Server } from 'socket.io'

type ClientToServerEvents = {
  message: (message: string) => void
}

type ServerToClientEvents = ClientToServerEvents

export function startWsConnection(
  ws: Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, any>,
) {
  ws.on('connection', function (socket) {
    logger.debug({ socket })

    socket.on('message', function (message) {
      logger.debug({ message })
      socket.emit('message', '')
    })
  })
}
