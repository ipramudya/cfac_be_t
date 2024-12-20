import { JWT_SECRET } from '@/constant'
import { logger } from '@/lib'
import { type JwtPayload, verify } from 'jsonwebtoken'
import io from 'socket.io'

export function jwt() {
  return function (socket: io.Socket, next: (err?: io.ExtendedError) => void) {
    const authHeader = socket.handshake.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      next(new Error('No authorization token provided'))
      socket.disconnect(true)
    } else {
      verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          logger.debug({ error: err })
          next(new Error('Invalid token'))
          socket.disconnect(true)
        }

        socket.handshake.auth = decoded as JwtPayload & JwtPayloadData
        next()
      })
    }
  }
}
