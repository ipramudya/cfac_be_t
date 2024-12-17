import { logger } from '@/lib'
import { HttpError } from '@/utils'
import type { Application, NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'

export function errorEndpoint(app: Application) {
  app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    const { message, stack } = err

    logger.error({ message })
    logger.debug({ stack, message })

    if (err instanceof HttpError) {
      res.status(err.status).json({ message: err.message, reason: err.data })
    } else {
      res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong!' })
    }
  })
}
