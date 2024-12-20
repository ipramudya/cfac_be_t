import { healthCheck } from '@/api/controller'
import { Router } from 'express'

export function healthcheckRoute() {
  const router = Router()

  router.get('/health', healthCheck)

  return router
}
