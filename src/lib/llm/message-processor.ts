import type { ChatMessage } from '../nosql/types'
import { aiModel } from './model'
import { parseLlmIntoJSON } from './parse-into-json'
import { EXTERNAL_PARAMETERS_PROMPT } from './prompts'
import { STRICT_RULES_PROMPT } from './prompts/strict-rules-prompt'
import type { LLMResponse } from './types'
import { validateLLMResponse } from './validate-response'
import type { Content } from '@google/generative-ai'

export async function processMessage(messages: ChatMessage[]): Promise<LLMResponse> {
  try {
    const contents = buildContents(messages)

    const result = await aiModel.generateContent({ contents })

    const parsedResponse = parseLlmIntoJSON(result.response.text())

    const validatedResponse = validateLLMResponse(parsedResponse)

    return validatedResponse
  } catch (error) {
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Failed to process messages')
    }
  }
}

function buildContents(messages: ChatMessage[]) {
  const contents = [
    {
      role: 'user',
      parts: [{ text: EXTERNAL_PARAMETERS_PROMPT }, { text: STRICT_RULES_PROMPT }],
    },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    {
      role: 'user',
      parts: [
        {
          text: 'Based on the last message, determine the API requirements. Remember to use "recipe" type for dietary preferences.',
        },
      ],
    },
  ] as Content[]

  return contents
}
