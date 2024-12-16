import { APP_URL } from '@/constant'
import corsSetup from 'cors'

export const cors = corsSetup({
  origin: APP_URL,
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
})
