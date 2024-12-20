import { healthcheckRoute } from './health-check'
import { userRoute } from './user'
import { Application } from 'express'

export function v1(app: Application) {
  app.use('/api/v1', healthcheckRoute(), userRoute())
}
