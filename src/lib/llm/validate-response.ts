import { API_SPECS } from '@/external/external-specs'
import { logger } from '../logger'
import { LLMResponse } from './types'

export function validateLLMResponse(response: any): LLMResponse {
  // Check if response type is valid
  if (!Object.keys(API_SPECS).includes(response.type)) {
    logger.warn('Invalid API type:', response.type)
    throw new Error(`Invalid response type: ${response.type}`)
  }

  // Add default values based on type
  const params = { ...response.params }

  switch (response.type) {
    case 'random-recipe':
      params.number = params.number || 1
      params.includeNutrition = true
      break

    case 'recipe':
      // Add required defaults for recipe search
      params.instructionsRequired = true
      params.fillIngredients = true
      params.addRecipeInformation = true
      params.addRecipeNutrition = true
      break

    case 'ingredient':
      params.number = params.number || 10
      params.metaInformation = true
      break
  }

  return {
    type: response.type,
    params,
    needsMoreInfo: response.needsMoreInfo,
    followUpQuestion: response.needsMoreInfo ? response.followUpQuestion : undefined,
  }
}
