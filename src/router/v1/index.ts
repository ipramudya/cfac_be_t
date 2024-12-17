import { Router } from 'express'
import { healthCheck } from './health'

export function v1() {
  const router = Router()

  router.use('/v1', healthCheck())

  return router
}
