import { Router } from 'express'
import { healthcheckRoute } from './health'
import { userRoute } from './user'

export function v1() {
  const router = Router()

  router.use('/v1', healthcheckRoute(), userRoute())

  return router
}
