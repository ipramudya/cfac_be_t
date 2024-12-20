import randomRecipe from './requirements/random-recipe.json'
import searchIngredients from './requirements/search-ingredients.json'
import searchRecipe from './requirements/search-recipe.json'
import quickAnswer from './requirements/trivia-quick-answer.json'
import type { ApiSpec, FormattedApiSpec } from './types'

function formatApiSpec(apiSpec: ApiSpec): FormattedApiSpec {
  return {
    name: apiSpec.endpoint.split('/').pop() ?? '',
    parameters: apiSpec.parameters.map((p) => ({
      name: p.name,
      type: p.type,
      required: p.description?.includes('Required') || false,
      example: p.example,
    })),
  }
}

export const API_SPECS = {
  recipe: formatApiSpec(searchRecipe),
  'random-recipe': formatApiSpec(randomRecipe),
  nutrition: formatApiSpec(quickAnswer),
  ingredient: formatApiSpec(searchIngredients),
} as const

export type ApiType = keyof typeof API_SPECS
