import { cache, db, logger } from '@/lib'
import { sql } from 'drizzle-orm'
import type { Request, Response } from 'express'
import status from 'http-status-codes'
import mongoose from 'mongoose'

export async function healthCheck(_: Request, res: Response) {
  const healthCheckResult: Record<string, any> = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'OK',
    services: {},
  }

  try {
    const pgResult = await checkPgHealth()
    healthCheckResult.services['postgresql'] = pgResult

    const mongoResult = await checkMongoHealth()
    healthCheckResult.services['mongodb'] = mongoResult

    const redisResult = await checkRedisHealth()
    healthCheckResult.services['redis'] = redisResult

    const isHealthy = Object.values(healthCheckResult.services).every(
      (service: any) => service.status === 'healthy',
    )

    const statusCode = isHealthy ? status.OK : status.SERVICE_UNAVAILABLE
    healthCheckResult.message = isHealthy ? 'OK' : 'Service Unavailable'

    res.status(statusCode).json(healthCheckResult)
  } catch (error) {
    logger.error('Health check failed:', error)

    res.status(status.INTERNAL_SERVER_ERROR).json({
      ...healthCheckResult,
      message: 'Error performing health check',
      error: (error as Error).message,
    })
  }
}

async function checkPgHealth() {
  try {
    const startTime = Date.now()
    const result = await db.execute(sql`SELECT 1 AS ok`)
    const responseTime = Date.now() - startTime

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      details: {
        connected: true,
        queryResult: result.rows[0]?.ok,
      },
    }
  } catch (error) {
    logger.error('PostgreSQL health check failed:', error)
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      details: {
        connected: false,
      },
    }
  }
}

async function checkMongoHealth() {
  try {
    const startTime = Date.now()
    const state = mongoose.connection.readyState
    const responseTime = Date.now() - startTime

    const remapState = new Map([
      [0, 'disconnected'],
      [1, 'connected'],
      [2, 'connecting'],
      [3, 'disconnecting'],
    ])

    return {
      status: state === 1 ? 'healthy' : 'unhealthy',
      responseTime: `${responseTime}ms`,
      details: {
        state: remapState.get(state) || 'unknown',
        connected: state === 1,
      },
    }
  } catch (error) {
    logger.error('MongoDB health check failed:', error)
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      details: {
        connected: false,
      },
    }
  }
}

async function checkRedisHealth() {
  try {
    const startTime = Date.now()
    await cache.ping()
    const responseTime = Date.now() - startTime

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      details: {
        connected: true,
      },
    }
  } catch (error) {
    logger.error('Redis health check failed:', error)
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      details: {
        connected: false,
      },
    }
  }
}
