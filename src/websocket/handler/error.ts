import { logger } from '@/lib'
import { SocketException } from '@/websocket/utils'
import status from 'http-status-codes'
import io from 'socket.io'

export function onError(socket: io.Socket, error: unknown) {
  const socketError = normalizeError(error)

  logger.error('Socket error occurred', {
    error: {
      name: socketError.name,
      message: socketError.message,
      code: socketError.code,
      data: socketError.data,
      context: {
        userId: socket.handshake.auth?.userId,
        event: socket.eventNames().join(', '),
      },
    },
  })

  socket.emit('error', {
    message: socketError.message,
    code: socketError.code,
  })
}

function normalizeError(error: unknown): SocketException {
  if (error instanceof SocketException) {
    return error
  }

  if (error instanceof Error) {
    return new SocketException(error.message, status.getStatusText(status.INTERNAL_SERVER_ERROR), {
      originalError: error,
    })
  }

  return new SocketException(
    typeof error === 'string' ? error : 'An unknown error occurred',
    status.getStatusText(status.INTERNAL_SERVER_ERROR),
  )
}
