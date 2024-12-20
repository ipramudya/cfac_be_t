import { GEMINI_API_KEY } from '@/constant'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
export const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
