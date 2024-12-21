import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '@/constant'
import { ExternalApiConfig } from './types'

export const apiConfig: ExternalApiConfig = {
  baseUrl: SPOONACULAR_BASE_URL,
  apiKey: SPOONACULAR_API_KEY,
  endpoints: {
    randomRecipe: '/recipes/random',
    searchRecipe: '/recipes/complexSearch',
    quickAnswer: '/recipes/quickAnswer',
    searchIngredients: '/food/ingredients/search',
  },
}
