import 'dotenv/config'

import { MODE, PORT } from '@/constant'
import { gracefulShutdown, logger } from '@/lib'
import { cors, limiter } from '@/middleware'
import * as routes from '@/router'

import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import http from 'node:http'

void (async function () {
  const app = express()

  // Express middleware initialization
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(compression())
  app.use(helmet())
  app.use(limiter)
  app.use(cors)

  if (MODE === 'production') {
    app.set('trust proxy', 1) // sets req.hostname, req.ip, etc.
  }

  // Routes loader
  app.use(routes.common())

  const httpServer = http.createServer(app)

  gracefulShutdown(httpServer)

  httpServer.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
  })
})()
