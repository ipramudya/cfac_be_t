export function API_RESPONSE_TEXT_PROMPT(type: string, text: string) {
  return `Convert this ${type} API response below to natural language and summarize the results into useful information:
${text}

GIVE FOLLOW UP QUESTION WITH THIS RULES:

1. For the recipe type
  - Ask if user wants to add one of the following information about: recipe information, recipe instructions, recipe nutrition, or fil ingredients.
  - If user wants to add one of them, append that information into params for the next conversation, and keep in the context type of recipe, and proceed directly without ask any follow-up question on the next conversation.

Respond in this format:
{
  "text": "Natural language response describing the API results",
  "followUpQuestion": "Optional follow-up question based on the context (if relevant)"
}`
}
