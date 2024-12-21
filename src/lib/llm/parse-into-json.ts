export function parseLlmIntoJSON(response: string) {
  try {
    let cleanedResponse = response

    // Try to match JSON content between code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    // Try to match JSON-like content
    const jsonLikeMatch = response.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      cleanedResponse = jsonMatch[1].trim()
    } else if (jsonLikeMatch) {
      cleanedResponse = jsonLikeMatch[0].trim()
    } else {
      cleanedResponse = response
        .replace(/```json\s*|\s*```/g, '')
        .replace(/\n\s*/g, '')
        .trim()
    }

    return JSON.parse(cleanedResponse)
  } catch {
    throw new Error('Unable to parse LLM response')
  }
}
