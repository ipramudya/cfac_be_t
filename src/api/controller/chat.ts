import { logger } from '@/lib'
import { deleteAllChatHistory, getChatHistory } from '@/lib/nosql/queries'
import { clearChatCache } from '@/lib/redis/methods'
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

export async function deleteMessages(req: Request, res: Response, next: NextFunction) {
  const authPayload = req.auth!

  try {
    Promise.all([deleteAllChatHistory(authPayload.userId), clearChatCache(authPayload.userId)])
    res.status(status.OK).json({ message: 'Messages deleted successfully' })
  } catch (error) {
    logger.debug({ error })
    return next(new Error('Failed to delete messages'))
  }
}
