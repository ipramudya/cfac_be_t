import { corsOptions } from '@/middleware'
import type { Server } from 'node:http'
import { Server as WebsocketServer } from 'socket.io'

export function createWsServer(server: Server) {
  return new WebsocketServer(server, {
    cors: corsOptions,
    serveClient: false,
    transports: ['polling', 'websocket'],
  })
}
