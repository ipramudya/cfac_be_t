import { getMessages } from '@/api/controller/chat'
import { Router } from 'express'

export function chatRoute() {
  const router = Router()

  router.get('/messages', getMessages)

  return router
}
