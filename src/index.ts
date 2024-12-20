import 'dotenv/config'
import { setupApi } from '@/api/setup'
import { PORT } from '@/constant'
import { connectMongoDB, logger } from '@/lib'
import { setupWebsocket } from '@/websocket/setup'
import express from 'express'
import http from 'node:http'

void (async function () {
  const app = express()
  const httpServer = http.createServer(app)

  await connectMongoDB()

  setupApi(app)
  setupWebsocket(httpServer)

  httpServer.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
  })
})()
