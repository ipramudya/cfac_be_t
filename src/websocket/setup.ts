import { APP_URL } from '@/constant'
import { onConnection } from './handler'
import { errorHandling, jwt, rateLimit } from './middleware'
import helmet from 'helmet'
import http from 'node:http'
import io from 'socket.io'

const socketOptions = {
  cors: {
    origin: APP_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  serveClient: false,
  transports: ['polling', 'websocket'],
} as io.ServerOptions

export function setupWebsocket(server: http.Server) {
  const ws = new io.Server(server, socketOptions)

  // Websocket middlewares
  ws.engine.use(helmet())
  ws.use(rateLimit())
  ws.use(jwt())
  ws.use(errorHandling())

  // Event handlers
  ws.on('connection', onConnection)
}
