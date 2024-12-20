import type { Socket } from 'socket.io'

const MINUTES = 60 * 1000
const MAX_REQUESTS = 100

export function rateLimit() {
  const WINDOW_MS = 15 * MINUTES
  const connections = new Map<string, { count: number; resetTime: number }>()

  setInterval(() => {
    const now = Date.now()
    for (const [clientId, info] of connections.entries()) {
      if (now > info.resetTime) {
        connections.delete(clientId)
      }
    }
  }, WINDOW_MS)

  return function (socket: Socket, next: (err?: Error) => void) {
    const clientId = socket.handshake.address

    const now = Date.now()
    const connectionInfo = connections.get(clientId)

    if (!connectionInfo) {
      connections.set(clientId, {
        count: 1,
        resetTime: now + WINDOW_MS,
      })
      return next()
    }

    if (now > connectionInfo.resetTime) {
      connectionInfo.count = 1
      connectionInfo.resetTime = now + WINDOW_MS
      return next()
    }

    if (connectionInfo.count >= MAX_REQUESTS) {
      return next(new Error('Too many requests'))
    }

    connectionInfo.count++
    next()
  }
}
