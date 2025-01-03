import type {
  FoodContextType,
  QuickAnswerParams,
  RandomRecipeParams,
  SearchIngredientsParams,
  SearchRecipeParams,
} from '@/external/requirements/types'

export interface LLMResponse {
  type: FoodContextType
  params: SearchRecipeParams | RandomRecipeParams | QuickAnswerParams | SearchIngredientsParams
  needsMoreInfo: boolean
  followUpQuestion?: string
}
