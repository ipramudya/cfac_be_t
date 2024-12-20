import rateLimit from 'express-rate-limit'

const MINUTES = 60 * 1000
const MAX_REQUESTS = 100

export function expressRateLimit() {
  return rateLimit({
    windowMs: 10 * MINUTES,
    limit: MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
  })
}
