import { LLMResponse } from './types'

export function validateLLMResponse(response: any): LLMResponse {
  if (
    !response.type ||
    !['recipe', 'nutrition', 'ingredient', 'random-recipe'].includes(response.type)
  ) {
    throw new Error(`Invalid response type: ${response.type}`)
  }

  // If we need more info, return early with just the follow-up question
  if (response.needsMoreInfo) {
    if (!response.followUpQuestion) {
      throw new Error('Missing follow-up question when needsMoreInfo is true')
    }
    return {
      type: response.type,
      params: {},
      needsMoreInfo: true,
      followUpQuestion: response.followUpQuestion,
    }
  }

  const params = { ...response.params }

  switch (response.type) {
    case 'recipe':
      // Validate required parameters
      if (!params.diet && !params.cuisine && !params.query) {
        throw new Error('Recipe search requires at least one search parameter')
      }

      // Add required defaults
      params.instructionsRequired = true
      params.fillIngredients = true
      params.addRecipeInformation = true
      params.addRecipeNutrition = true
      params.number = params.number || 10
      break

    case 'ingredient':
      if (!params.query) {
        throw new Error('Ingredient search requires query parameter')
      }
      params.number = params.number || 10
      params.metaInformation = true
      break

    case 'nutrition':
      if (!params.q) {
        throw new Error('Nutrition queries require a q parameter')
      }
      break
  }

  return {
    type: response.type,
    params,
    needsMoreInfo: false,
  }
}
