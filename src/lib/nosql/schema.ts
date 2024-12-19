import mongoose, { Document, Schema } from 'mongoose'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

type ChatHistory = Document & {
  userId: string
  messages: ChatMessage[]
}

const chatSchema = new Schema<ChatHistory>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
})

export const ChatModel = mongoose.model<ChatHistory>('Chat', chatSchema)
