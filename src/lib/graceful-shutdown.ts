import type { Server } from 'node:http'
import { logger } from './winston-logger'

export function gracefulShutdown(server: Server) {
  const signals = ['SIGINT', 'SIGTERM']

  signals.forEach((signal) => {
    process.on(signal, () => {
      try {
        server.close((error) => {
          if (error) throw error
        })
        logger.info(`Server closed on ${signal}`)
        process.exit(0)
      } catch (error) {
        logger.error(`Error close server: ${(error as Error).message}`)
        process.exit(1)
      }
    })
  })
}
