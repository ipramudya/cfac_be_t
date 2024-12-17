import { APP_URL } from '@/constant'
import corsSetup from 'cors'

export function cors() {
  return corsSetup({
    origin: APP_URL,
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  })
}
