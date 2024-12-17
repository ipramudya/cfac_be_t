import { logger } from '@/lib'
import type { Application, NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'

export function errorEndpoint(app: Application) {
  app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    const { message, stack } = err

    logger.error({ message, stack })

    res.status(status.INTERNAL_SERVER_ERROR).send('Something went wrong!')
  })
}
