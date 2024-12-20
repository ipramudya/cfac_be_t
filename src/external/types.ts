export interface ApiParameter {
  name: string
  type: string
  example: any
  description: string
}

export interface ApiSpec {
  method: string
  endpoint: string
  parameters: ApiParameter[]
}

export interface FormattedApiSpec {
  name: string
  parameters: {
    name: string
    type: string
    required: boolean
    example: any
  }[]
}

// API Parameter Types
export interface RandomRecipeParams {
  includeNutrition?: boolean
  number?: number
}

export interface SearchRecipeParams {
  query: string
  cuisine?: string
  diet?: string
  type?: string
  maxReadyTime?: number
  minServings?: number
  maxServings?: number
  sort?: string
  sortDirection?: 'asc' | 'desc'
  instructionsRequired?: boolean
  fillIngredients?: boolean
  addRecipeInformation?: boolean
  addRecipeNutrition?: boolean
  maxCalories?: number
  minCalories?: number
  maxCarbs?: number
  minCarbs?: number
  maxProtein?: number
  minProtein?: number
  maxFat?: number
  minFat?: number
  maxSugar?: number
  minSugar?: number
  number?: number
}

export interface QuickAnswerParams {
  q: string
}

export interface SearchIngredientsParams {
  query: string
  addChildren?: boolean
  minProteinPercent?: number
  maxProteinPercent?: number
  minFatPercent?: number
  maxFatPercent?: number
  minCarbsPercent?: number
  maxCarbsPercent?: number
  metaInformation?: boolean
  sort?: string
  sortDirection?: 'asc' | 'desc'
  offset?: number
  number?: number
}

export type FoodContextType = 'recipe' | 'random-recipe' | 'nutrition' | 'ingredient'
