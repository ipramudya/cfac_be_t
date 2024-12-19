import { logger } from './winston-logger'
import mongoose from 'mongoose'
import type { Server } from 'node:http'

const signals = ['SIGINT', 'SIGTERM']

export function gracefulShutdown(server: Server) {
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error) reject(error)
            resolve()
          })
        })

        await mongoose.disconnect()
        logger.info('Successfully disconnected from MongoDB')
        logger.info(`Server closed on ${signal}`)
        process.exit(0)
      } catch (error) {
        logger.error(`Error close server: ${(error as Error).message}`)
        process.exit(1)
      }
    })
  })
}
