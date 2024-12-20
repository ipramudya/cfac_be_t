import { REDIS_URL } from '@/constant'
import Redis from 'ioredis'

export const cache = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableAutoPipelining: true,
})
