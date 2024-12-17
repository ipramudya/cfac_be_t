import { logger } from '@/lib'
import { Router } from 'express'

export function healthCheck() {
  const router = Router()

  router.get('/health', (_, res) => {
    logger.info('API is running')

    res.status(200).json({ message: 'API is running' })
  })

  return router
}
