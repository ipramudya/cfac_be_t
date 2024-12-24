import { SocketException } from './socket-exception'
import { z } from 'zod'

export const messagePayloadSchema = z.object({
  text: z.string().min(1, { message: 'Message text is required' }),
  timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    message: 'Invalid timestamp format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
  }),
})

export function validateMessagePayload(payload: unknown): MessagePayload {
  try {
    return messagePayloadSchema.parse(payload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new SocketException('Invalid message payload', 'INVALID_PAYLOAD', error.issues)
    }
    throw new SocketException('Failed to validate message payload', 'VALIDATION_FAILED')
  }
}

export type MessagePayload = z.infer<typeof messagePayloadSchema>
