export const PORT = process.env.PORT
export const MODE = process.env.NODE_ENV as 'production' | 'development'
export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`
export const DATABASE_URL = process.env.DATABASE_URL!
export const HASH_SALT = 8
