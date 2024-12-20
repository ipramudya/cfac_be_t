import type { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & JwtPayloadData
    }
  }

  type JwtPayloadData = {
    userId: string
    username: string
  }
}
