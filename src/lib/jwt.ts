import { JWT_SECRET } from '@/constant'
import jsonwebtoken, { type JwtPayload } from 'jsonwebtoken'

export type JwtPayloadData = {
  userId: string
  username: string
}

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & JwtPayloadData
    }
  }
}

export function generateToken(payload: JwtPayloadData) {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}
