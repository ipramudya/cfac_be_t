import type { LLMResponse } from '@/lib/llm/types'
import type { ChatMessage } from '@/lib/nosql/types'
import { makeApiCall } from './client'
import { apiConfig } from './config'
import type {
  QuickAnswerResponse,
  RandomRecipeResponse,
  SearchIngredientsResponse,
  SearchRecipeResponse,
} from './types'
import { v4 as uuid } from 'uuid'

export async function processExternalApi(llmResponse: LLMResponse): Promise<ChatMessage> {
  const { type, params } = llmResponse

  switch (type) {
    case 'random-recipe':
      return await handleRandomRecipe(params)
    case 'recipe':
      return await handleRecipeSearch(params)
    case 'nutrition':
      return await handleNutritionQuery(params)
    case 'ingredient':
      return await handleIngredientSearch(params)
    default:
      throw new Error(`Unsupported API type: ${type}`)
  }
}

async function handleRandomRecipe(params: any): Promise<ChatMessage> {
  const response = await makeApiCall<RandomRecipeResponse>(apiConfig.endpoints.randomRecipe, params)

  if (!response.success || !response.data) {
    throw new Error('Failed to fetch random recipe')
  }

  const recipe = response.data.recipes[0]

  return {
    text: JSON.stringify(recipe), // This will be processed by LLM later
    role: 'assistant',
    timestamp: new Date(),
    contextId: uuid(),
    metadata: {
      type: 'recipe',
      data: recipe,
    },
  }
}

async function handleRecipeSearch(params: any): Promise<ChatMessage> {
  const response = await makeApiCall<SearchRecipeResponse>(apiConfig.endpoints.searchRecipe, params)

  if (!response.success || !response.data) {
    throw new Error('Failed to search recipes')
  }

  return {
    text: JSON.stringify(response.data.results),
    role: 'assistant',
    timestamp: new Date(),
    contextId: uuid(),
    metadata: {
      type: 'recipe',
      data: response.data,
    },
  }
}

async function handleNutritionQuery(params: any): Promise<ChatMessage> {
  const response = await makeApiCall<QuickAnswerResponse>(apiConfig.endpoints.quickAnswer, params)

  if (!response.success || !response.data) {
    throw new Error('Failed to get nutrition information')
  }

  return {
    text: response.data.answer,
    role: 'assistant',
    timestamp: new Date(),
    contextId: uuid(),
    metadata: {
      type: 'nutrition',
      data: response.data,
    },
  }
}

async function handleIngredientSearch(params: any): Promise<ChatMessage> {
  const response = await makeApiCall<SearchIngredientsResponse>(
    apiConfig.endpoints.searchIngredients,
    params,
  )

  if (!response.success || !response.data) {
    throw new Error('Failed to search ingredients')
  }

  return {
    text: JSON.stringify(response.data.results),
    role: 'assistant',
    timestamp: new Date(),
    contextId: uuid(),
    metadata: {
      type: 'ingredient',
      data: response.data,
    },
  }
}
