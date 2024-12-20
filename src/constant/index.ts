export const PORT = process.env.PORT
export const MODE = process.env.NODE_ENV as 'production' | 'development'
export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`
export const DATABASE_URL = process.env.DATABASE_URL!
export const HASH_SALT = 8
export const JWT_SECRET = process.env.JWT_SECRET!
export const MONGODB_URI = process.env.MONGODB_URI!
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
