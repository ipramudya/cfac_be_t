import { deleteMessages, getMessages } from '@/api/controller/chat'
import { Router } from 'express'

export function chatRoute() {
  const router = Router()

  router.get('/messages', getMessages)
  router.delete('/messages', deleteMessages)

  return router
}
