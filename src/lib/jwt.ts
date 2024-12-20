import { JWT_SECRET } from '@/constant'
import jsonwebtoken from 'jsonwebtoken'

export function generateToken(payload: JwtPayloadData) {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}
