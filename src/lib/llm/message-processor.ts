import type { ChatMessage } from '../nosql/types'
import { aiModel } from './gemini'
import { SYSTEM_PROMPT } from './prompt'
import type { LLMResponse } from './types'
import { validateLLMResponse } from './validate-response'

export async function processMessage(messages: ChatMessage[]): Promise<LLMResponse> {
  const conversation = messages.map((m) => `${m.role}: ${m.text}`).join('\n')

  const prompt = `${SYSTEM_PROMPT}\n\nConversation:\n${conversation}\n\nAnalyze the last message and determine the API requirements.`

  try {
    const result = await aiModel.generateContent(prompt)
    const response = result.response.text()

    const cleanedResponse = cleanLLMJsonResponse(response)

    const parsedResponse = JSON.parse(cleanedResponse)

    const validatedResponse = validateLLMResponse(parsedResponse)

    return validatedResponse
  } catch (error) {
    throw new Error('Failed to parse LLM response')
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
