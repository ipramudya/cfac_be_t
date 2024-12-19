import 'dotenv/config'
import { MODE, PORT } from '@/constant'
import { connectMongoDB, createWsServer, gracefulShutdown, logger } from '@/lib'
import { cors, expressJWT, expressRateLimit, socketRateLimit, websocketJWT } from '@/middleware'
import * as routes from '@/router'
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import http from 'node:http'

void (async function () {
  const app = express()
  const httpServer = http.createServer(app)
  const ws = createWsServer(httpServer)

  await connectMongoDB()

  if (MODE === 'production') {
    app.set('trust proxy', 1) // sets req.hostname, req.ip, etc.
  }

  // Express middleware initialization
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(compression())
  app.use(helmet())
  app.use(cors())
  app.use(expressRateLimit())
  app.use(expressJWT({ excludedPaths: ['/health', '/register', '/login'] }))

  // Router initialization
  app.use('/api', routes.v1())

  // Catch all endpoints
  routes.notFoundEndpoint(app)
  routes.errorEndpoint(app)

  // Socket middleware
  ws.engine.use(helmet())
  ws.use(socketRateLimit())
  ws.use(websocketJWT())

  // WebSocket connection handler
  routes.startWsConnection(ws)

  gracefulShutdown(httpServer)

  httpServer.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
  })
})()
