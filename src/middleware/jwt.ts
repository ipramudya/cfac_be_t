import { JWT_SECRET } from '@/constant'
import { type JwtPayloadData, logger } from '@/lib'
import { HTTPException } from '@/utils'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'
import { type JwtPayload, verify } from 'jsonwebtoken'
import type { ExtendedError } from 'socket.io'

interface JWTMiddlewareOptions {
  excludedPaths: string[]
}

export function expressJWT(options: JWTMiddlewareOptions) {
  const { excludedPaths } = options

  return function (req: Request, _: Response, next: NextFunction) {
    const isPathExcluded = excludedPaths.some((path) => req.path.includes(path))
    if (isPathExcluded) {
      return next()
    }

    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

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

export function websocketJWT() {
  return function (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) {
    const authHeader = socket.request.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      next(new Error('No authorization token provided'))
      socket.disconnect(true)
    } else {
      verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          logger.debug({ error: err })
          next(new Error('Invalid token'))
          socket.disconnect(true)
        }

        socket.request.auth = decoded as JwtPayload & JwtPayloadData
        next()
      })
    }
  }
}
