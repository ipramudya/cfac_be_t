import { Application } from 'express'
import status from 'http-status-codes'

export function notFoundEndpoint(app: Application) {
  app.use((_, res) => {
    res.status(status.NOT_FOUND).json({ message: 'Endpoint Not found' })
  })
}
