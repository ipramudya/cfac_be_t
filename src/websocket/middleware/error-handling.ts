import { onError } from '@/websocket/handler'
import { SocketException } from '@/websocket/utils'
import io from 'socket.io'

export function errorHandling() {
  return function (socket: io.Socket, next: (err?: io.ExtendedError) => void) {
    socket.on('error', (error: SocketException) => {
      onError(socket, error)
    })

    socket.use((_, next) => {
      Promise.resolve(next()).catch((error) => {
        onError(socket, error)
      })
    })

    next()
  }
}
