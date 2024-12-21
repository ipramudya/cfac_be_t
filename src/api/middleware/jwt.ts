import { HTTPException } from '@/api/utils'
import { JWT_SECRET } from '@/constant'
import { logger } from '@/lib'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'
import { JwtPayload, verify } from 'jsonwebtoken'

export function jwt(options: { excludedPaths: string[] }) {
  return function (req: Request, _: Response, next: NextFunction) {
    const isExcluded = options.excludedPaths.some((path) => req.path.includes(path))

    if (isExcluded) return next()

    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return next(new HTTPException(status.UNAUTHORIZED, 'No authorization token provided'))
    }

    verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.debug({ error: err })
        return next(new HTTPException(status.FORBIDDEN, 'Invalid token'))
      }

      req.auth = decoded as JwtPayload & JwtPayloadData
      next()
    })
  }
}
