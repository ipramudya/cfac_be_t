import { logger } from '@/lib'
import { getChatHistory } from '@/lib/nosql/queries'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  const authPayload = req.auth!

  try {
    const messages = await getChatHistory(authPayload.userId)
    res.status(status.OK).json({ messages })
  } catch (error) {
    logger.debug({ error })
    return next(new Error('Failed to retrieve messages'))
  }
}
