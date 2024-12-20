import { changePassword, login, register } from '@/api/controller'
import { Router } from 'express'

export function userRoute() {
  const router = Router()

  router.post('/register', register)
  router.post('/login', login)
  router.post('/change-password', changePassword)

  return router
}
