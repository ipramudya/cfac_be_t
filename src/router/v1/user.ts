import * as controller from '@/controller'
import { Router } from 'express'

export function userRoute() {
  const router = Router()

  router.route('/user').post(controller.register)

  return router
}
