import { logger } from './winston-logger'
import mongoose from 'mongoose'

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
} as const

export async function connectMongoDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, clientOptions)
    if (conn.connection.readyState === 1 && conn.connection.db) {
      await conn.connection.db.admin().command({ ping: 1 })
      logger.info('MongoDB connected successfully')
    }
  } catch (error) {
    await mongoose.disconnect()
    logger.error('Error connecting to MongoDB cluster', error)
    process.exit(1)
  }
}
