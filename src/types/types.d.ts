import type { JwtPayloadData } from '@/lib/jwt'
import type { JwtPayload } from 'jsonwebtoken'
import type { Socket } from 'socket.io'

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & JwtPayloadData
    }
  }

  type AuthenticatedSocket = Socket & {
    request: {
      headers: {
        authorization?: string
      }
      auth?: JwtPayload & JwtPayloadData
    }
  }
}
