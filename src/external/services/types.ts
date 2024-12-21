export interface ApiResponse<T extends Record<string, any>> {
  success: boolean
  data?: T
  error?: string
}

export interface ExternalApiConfig {
  baseUrl: string
  apiKey: string
  endpoints: {
    randomRecipe: string
    searchRecipe: string
    quickAnswer: string
    searchIngredients: string
  }
}

// API Response Types
export interface RandomRecipeResponse {
  recipes: Array<{
    id: number
    title: string
    image: string
    summary: string
    instructions: string
    readyInMinutes: number
    servings: number
    sourceUrl: string
    nutrition?: {
      nutrients: Array<{
        name: string
        amount: number
        unit: string
      }>
    }
  }>
}

export interface SearchRecipeResponse {
  results: Array<{
    id: number
    title: string
    image: string
    imageType: string
  }>
  offset: number
  number: number
  totalResults: number
}

export interface QuickAnswerResponse {
  answer: string
  image: string
}

export interface SearchIngredientsResponse {
  results: Array<{
    id: number
    name: string
    image: string
    nutrition: {
      nutrients: Array<{
        name: string
        amount: number
        unit: string
      }>
    }
  }>
  offset: number
  number: number
  totalResults: number
}
