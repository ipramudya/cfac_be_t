import { rateLimit } from 'express-rate-limit'

const MINUTES = 60 * 1000

export function limiter() {
  return rateLimit({
    windowMs: 15 * MINUTES,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
}
