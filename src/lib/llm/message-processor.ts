import type { ChatMessage } from '../nosql/types'
import { aiModel } from './model'
import { EXTERNAL_PARAMETERS_PROMPT } from './prompts'
import { STRICT_RULES_PROMPT } from './prompts/strict-rules-prompt'
import type { LLMResponse } from './types'
import { validateLLMResponse } from './validate-response'
import type { Content } from '@google/generative-ai'

export async function processMessage(messages: ChatMessage[]): Promise<LLMResponse> {
  try {
    const contents = buildContents(messages)

    const result = await aiModel.generateContent({ contents })
    const response = result.response.text()

    const cleanedResponse = cleanLLMJsonResponse(response)

    const parsedResponse = JSON.parse(cleanedResponse)

    const validatedResponse = validateLLMResponse(parsedResponse)

    return validatedResponse
  } catch (error) {
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Failed to parse LLM response')
    }
  }
}

function cleanLLMJsonResponse(response: string): string {
  try {
    // First try to find JSON content between code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      return jsonMatch[1].trim()
    }

    // If no code blocks, try to find JSON-like content
    const jsonLikeMatch = response.match(/\{[\s\S]*\}/)
    if (jsonLikeMatch) {
      return jsonLikeMatch[0].trim()
    }

    // If all else fails, return the cleaned original
    return response
      .replace(/```json\s*|\s*```/g, '')
      .replace(/\n\s*/g, '')
      .trim()
  } catch {
    throw new Error('Unable to clean LLM response')
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
          text: 'Based on the last message, determine the API requirements. Remember to use "recipe" type for dietary preferences and include appropriate parameters.',
        },
      ],
    },
  ] as Content[]

  return contents
}
