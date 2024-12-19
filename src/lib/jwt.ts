import { JWT_SECRET } from '@/constant'
import jsonwebtoken from 'jsonwebtoken'

export type JwtPayloadData = {
  userId: string
  username: string
}

export function generateToken(payload: JwtPayloadData) {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}
