import { logger } from '@/lib'
import { Router } from 'express'

export function common(): Router {
  const router = Router()

  router.get('/api', (_, res) => {
    logger.info('API is running')
    res.status(200).json({ message: 'API is running' })
  })

  return router
}
