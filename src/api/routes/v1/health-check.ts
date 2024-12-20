import { db, logger } from '@/lib'
import { sql } from 'drizzle-orm'
import { Router } from 'express'
import status from 'http-status-codes'

export function healthcheckRoute() {
  const router = Router()

  router.get('/health', async (_, res) => {
    const healthCheckResult: Record<string, any> = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }

    try {
      const result = await db.execute(sql`SELECT 1 AS ok`)
      healthCheckResult['database'] = {
        status: 'ok',
        queryResult: result.rows[0]?.ok,
      }

      res.status(status.OK).json(healthCheckResult)
    } catch (error) {
      logger.error('Database healthcheck failed:', error)

      healthCheckResult['database'] = {
        status: 'unhealthy',
        queryResult: (error as Error).message,
      }

      res.status(status.INTERNAL_SERVER_ERROR).json(healthCheckResult)
    }
  })

  return router
}
