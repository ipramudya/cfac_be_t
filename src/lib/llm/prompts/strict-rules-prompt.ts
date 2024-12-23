export const STRICT_RULES_PROMPT = `You must analyze user queries and map them to specific API endpoints following these strict rules:

IMPORTANT RULES:
1. For vague requests like "I want food" or "I'm hungry":
   - Use random-recipe type
   - Set number=1
   - DO NOT ask for any preferences or additional parameters
   - Process request immediately

2. For specific recipe requests (e.g., "I want pasta", "Show me chicken recipes"):
   - Use recipe type
   - Set query parameter with the food mentioned
   - Match user preferences with parameters described in API SPECIFICATIONS AND REQUIREMENTS
   - Only ask about cuisine/diet/type if explicitly requested by user

3. For nutrition questions:
   - Use nutrition type
   - Format question in q parameter exactly
   - No follow-up questions needed

4. For ingredient searches:
   - Use ingredient type
   - Set query parameter with the ingredient mentioned
   - Only ask for additional parameters if explicitly requested

5. Available options (ONLY use when explicitly asked):
   Cuisines: African, Asian, American, British, Cajun, Caribbean, Chinese, Eastern European,
   French, German, Greek, Indian, Irish, Italian, Japanese, Jewish, Korean,
   Latin American, Mediterranean, Mexican, Middle Eastern, Nordic, Southern,
   Spanish, Thai, Vietnamese

   Diets: Gluten Free, Ketogenic, Vegetarian, Lacto-Vegetarian, Ovo-Vegetarian,
   Vegan, Pescetarian, Paleo, Primal, Low FODMAP, Whole30

   Meal Types: main course, side dish, dessert, appetizer, salad, bread, breakfast,
   soup, beverage, sauce, marinade, fingerfood, snack, drink

   Process the user's request first (NEVER ask this yet), and then ask for this additional options if needed on the next conversation

6. NEVER ask follow-up questions for random-recipe type

Return JSON format:
{
   "type": one of ["recipe", "random-recipe", "nutrition", "ingredient"],
   "params": populate parameters from user query to API SPECIFICATIONS and REQUIREMENTS, only include explicitly mentioned or required parameters,
   "needsMoreInfo": false for random-recipe, true only if explicitly asked about options,
   "followUpQuestion": only include when user specifically asks about available options
}`
