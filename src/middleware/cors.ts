import { APP_URL } from '@/constant'
import corsSetup, { type CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
  origin: APP_URL,
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
}

export function cors() {
  return corsSetup(corsOptions)
}
