import { FoodContextType } from '@/external/requirements/types'
import { ChatMessage } from '../nosql/types'
import { aiModel } from './model'
import { parseLlmIntoJSON } from './parse-into-json'

export async function processApiResponse(
  apiResponse: ChatMessage,
  type: FoodContextType,
): Promise<ChatMessage> {
  const prompt = `
Convert this ${type} API response to natural language and optionally provide a relevant follow-up question:
${apiResponse.text}

Respond in this format:
{
  "text": "Natural language response describing the API results",
  "followUpQuestion": "Optional follow-up question based on the context (if relevant)"
}`

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]

  const result = await aiModel.generateContent({ contents })
  const parsedResult = parseLlmIntoJSON(result.response.text())

  let responseText = parsedResult.text

  if (parsedResult.followUpQuestion) {
    responseText += `\n\n${parsedResult.followUpQuestion}`
  }

  return {
    ...apiResponse,
    text: responseText,
  }
}
