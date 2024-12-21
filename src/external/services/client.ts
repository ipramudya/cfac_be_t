import { logger } from '@/lib/logger'
import { apiConfig } from './config'
import { ApiResponse } from './types'

export async function makeApiCall<T extends Record<string, any>>(
  endpoint: string,
  params: Record<string, any>,
): Promise<ApiResponse<T>> {
  try {
    // Build URL with query parameters
    const url = new URL(endpoint, apiConfig.baseUrl)
    url.searchParams.append('apiKey', apiConfig.apiKey)

    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })

    logger.info('Make API call to external service', { info: { endpoint: url.toString() } })

    // Make request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = (await response.json()) as T

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error('API call failed', {
      error: {
        endpoint,
        params,
        reason: error instanceof Error ? error.message : 'Unknown error',
      },
    })

    return {
      success: false,
      error: 'Failed to fetch data from external API',
    }
  }
}
