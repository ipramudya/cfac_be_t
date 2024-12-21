import { HASH_SALT } from '@/constant'
import bcrypt from 'bcryptjs'

export async function createHashedPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(HASH_SALT)
  return bcrypt.hash(password, salt)
}
