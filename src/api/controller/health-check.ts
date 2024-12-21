import { cache, db, logger } from '@/lib'
import { sql } from 'drizzle-orm'
import type { Request, Response } from 'express'
import status from 'http-status-codes'
import mongoose from 'mongoose'

type ServiceHealth = {
  status: 'healthy' | 'unhealthy'
  responseTime?: string
  error?: string
  details: Record<string, any>
}

type HealthCheckResponse = {
  uptime: number
  timestamp: string
  message: string
  services: Record<string, ServiceHealth>
}

export async function healthCheck(_: Request, res: Response) {
  const response: HealthCheckResponse = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'OK',
    services: {},
  }

  try {
    const services = await Promise.all([
      checkServiceHealth('postgresql', checkPgHealth),
      checkServiceHealth('mongodb', checkMongoHealth),
      checkServiceHealth('redis', checkRedisHealth),
    ])

    response.services = {
      postgresql: services[0],
      mongodb: services[1],
      redis: services[2],
    }

    const isHealthy = Object.values(response.services).every(
      (service) => service.status === 'healthy',
    )

    response.message = isHealthy ? 'OK' : 'Service Unavailable'
    res.status(isHealthy ? status.OK : status.SERVICE_UNAVAILABLE).json(response)
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(status.INTERNAL_SERVER_ERROR).json({
      ...response,
      message: 'Error performing health check',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

async function checkServiceHealth(
  serviceName: string,
  checker: () => Promise<ServiceHealth>,
): Promise<ServiceHealth> {
  try {
    return await checker()
  } catch (error) {
    logger.error(`${serviceName} health check failed:`, error)
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { connected: false },
    }
  }
}

async function checkPgHealth(): Promise<ServiceHealth> {
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

async function checkMongoHealth(): Promise<ServiceHealth> {
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

async function checkRedisHealth(): Promise<ServiceHealth> {
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
