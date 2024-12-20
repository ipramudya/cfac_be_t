import { API_SPECS, type ApiType } from '@/external/external-specs'
import { FormattedApiSpec } from '@/external/types'

export const SYSTEM_PROMPT = `You are a nutritionist assistant. Analyze user messages and return API parameters matching these specifications:

${Object.entries(API_SPECS)
  .map(([type, spec]) => generateApiSection(type as ApiType, spec))
  .join('\n\n')}

IMPORTANT:
- Only use parameters listed above for each type
- Always include required parameters
- Set needsMoreInfo: true when user input is unclear

Return JSON format:
{
  "type": API type,
  "params": parameters matching the API spec exactly,
  "needsMoreInfo": boolean,
  "followUpQuestion": string (if needsMoreInfo is true)
}`

/**
 * Generates a formatted API section for the LLM prompt based on API specifications.
 * This function takes an API type and its specification, then formats it into a
 * human-readable string that includes required parameters, optional parameters,
 * and a concrete example.
 *
 * @param type - The API type (e.g., 'recipe', 'random-recipe', 'nutrition', 'ingredient')
 * @param spec - The formatted API specification containing parameters and their details
 * @returns A formatted string containing API documentation
 *
 * @example
 * const spec = {
 *   name: 'random',
 *   parameters: [
 *     { name: 'number', type: 'number', required: true, example: 1 },
 *     { name: 'tags', type: 'string[]', required: false, example: ['vegetarian'] }
 *   ]
 * }
 *
 * const result = generateApiSection('random-recipe', spec)
 * // Returns:
 * // random-recipe:
 * // Required parameters:
 * // - number (number, Required)
 * //
 * // Optional parameters:
 * // - tags (string[])
 * // Example: {
 * //   "type": "random-recipe",
 * //   "params": {
 * //     "number": 1,
 * //     "tags": ["vegetarian"]
 * //   }
 * // }
 */
function generateApiSection(type: ApiType, spec: FormattedApiSpec): string {
  const required = spec.parameters
    .filter((p) => p.required)
    .map((p) => `- ${p.name} (${p.type}, Required)`)
    .join('\n')

  const optional = spec.parameters
    .filter((p) => !p.required)
    .map((p) => `- ${p.name} (${p.type})`)
    .join('\n')

  return `${type}:
${required ? `Required parameters:\n${required}\n` : ''}
${optional ? `Optional parameters:\n${optional}` : ''}
Example: ${JSON.stringify(
    {
      type,
      params: Object.fromEntries(
        spec.parameters.filter((p) => p.example !== undefined).map((p) => [p.name, p.example]),
      ),
    },
    null,
    2,
  )}`
}
