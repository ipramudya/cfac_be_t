import { JWT_SECRET } from '@/constant'
import { logger } from '@/lib'
import { HttpError } from '@/utils'
import { NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'
import { type JwtPayload, verify } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

interface JWTMiddlewareOptions {
  excludedPaths: string[]
}

export function jwt(options: JWTMiddlewareOptions) {
  const { excludedPaths } = options

  return function (req: Request, _: Response, next: NextFunction) {
    const isPathExcluded = excludedPaths.some((path) => req.path.includes(path))
    if (isPathExcluded) {
      return next()
    }

    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return next(new HttpError(status.UNAUTHORIZED, 'No authorization token provided'))
    }

    verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.debug({ error: err })
        return next(new HttpError(status.FORBIDDEN, 'Invalid token'))
      }

      req.user = decoded as JwtPayload
      next()
    })
  }
}
