import { MODE } from '@/constant'
import { cors, expressRateLimit, jwt } from './middleware'
import * as routes from './routes'
import compression from 'compression'
import express, { type Application } from 'express'
import helmet from 'helmet'

export function setupApi(app: Application) {
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
  app.use(jwt({ excludedPaths: ['/health', '/register', '/login'] }))

  // Catch all endpoints
  routes.v1(app)
  routes.errorHandling(app)
  routes.notFound(app)
}
