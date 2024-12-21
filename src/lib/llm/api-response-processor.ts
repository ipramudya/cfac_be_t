import { FoodContextType } from '@/external/requirements/types'
import { ChatMessage } from '../nosql/types'
import { aiModel } from './model'
import { parseLlmIntoJSON } from './parse-into-json'
import { API_RESPONSE_TEXT_PROMPT } from './prompts/api-response-prompt'

export async function processApiResponse(
  apiResponse: ChatMessage,
  type: FoodContextType,
): Promise<ChatMessage> {
  const contents = [
    {
      role: 'user',
      parts: [{ text: API_RESPONSE_TEXT_PROMPT(type, apiResponse.text) }],
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
