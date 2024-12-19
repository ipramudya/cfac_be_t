import { ChatModel } from './schema'

// Retrieve user chat history
export async function getUserChatHistory(userId: string): Promise<any[]> {
  const chat = await ChatModel.findOne({ userId })
  return chat?.messages || []
}

// Update user chat history
export async function updateUserChatHistory(
  userId: string,
  newMessage: { role: 'user' | 'assistant'; text: string },
) {
  await ChatModel.updateOne({ userId }, { $push: { messages: newMessage } }, { upsert: true })
}
