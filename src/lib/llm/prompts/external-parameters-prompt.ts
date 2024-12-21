import randomRecipe from '@/external/requirements/random-recipe.json'
import searchIngredients from '@/external/requirements/search-ingredients.json'
import searchRecipe from '@/external/requirements/search-recipe.json'
import triviaQuickAnswer from '@/external/requirements/trivia-quick-answer.json'

export const EXTERNAL_PARAMETERS_PROMPT = `API SPECIFICATIONS AND REQUIREMENTS: 

1. Random Recipe API
${JSON.stringify(randomRecipe, null, 2)}

2. Search Ingredients API
${JSON.stringify(searchIngredients, null, 2)}

3. Search Recipe API
${JSON.stringify(searchRecipe, null, 2)}

4. Quick Answer API
${JSON.stringify(triviaQuickAnswer, null, 2)}

USAGE GUIDELINES:
- Each API endpoint serves a specific purpose
- Parameters should be validated against their specifications
- All required parameters must be included`
