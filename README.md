# CFAC-T Server

## About the Project

CFAC-T Server is a robust backend service that provides recipe and nutrition information through a combination of RESTful APIs and WebSocket connections. It features a chat-based interface powered by AI to help users discover recipes, get nutritional information, and learn about ingredients.

## Purpose

The main purpose of this project is to create an intelligent food assistant that can:

- Provide recipe recommendations
- Answer nutrition-related questions
- Search for ingredients and their properties
- Maintain context-aware conversations about food and cooking

## Main Features

- 🔐 JWT-based authentication
- 🤖 AI-powered conversational interface using Google's Gemini AI
- 🔄 Real-time communication via WebSocket
- 💾 Persistent chat history with MongoDB
- 🚀 Caching with Redis
- 🔍 Integration with Spoonacular API for food data
- 🛡️ Rate limiting and security middleware
- 🎯 Health monitoring endpoints

## Tech Stack

- **Programming Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**:
  - PostgreSQL (user management)
  - MongoDB (chat history)
  - Redis (caching)
- **WebSocket**: Socket.IO
- **AI**: Google Gemini AI
- **ORM/Query Builder**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: JWT
- **External API**: Spoonacular API

## Project Structure

```
src/
├── api/           # REST API endpoints and middleware
├── constant/      # Application constants and configuration
├── external/      # External API integration
├── lib/          # Core libraries and utilities
├── types/        # TypeScript type definitions
└── websocket/    # WebSocket handlers and middleware
```

## Requirements

- Node.js >= 18.0.0
- npm >= 7.0.0
- PostgreSQL >= 13
- MongoDB >= 5.0
- Redis >= 6.0

## Dependencies Setup

1. Create a `.env` file with the following variables:

```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
MONGODB_URI=mongodb://localhost:27017/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
SPOONACULAR_API_KEY=your-spoonacular-api-key
SPOONACULAR_BASE_URL=https://api.spoonacular.com
```

2. Install dependencies:

```bash
npm install
```

3. Setup databases:

```bash
# PostgreSQL schema migration
npm run db:push

# Ensure MongoDB and Redis are running
```

## Running the Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build the project
npm run build

# Start the server
npm start
```

### Additional Scripts

- `npm run typecheck`: Run TypeScript type checking
- `npm run fmt`: Format code using Prettier
- `npm run lint`: Lint and fix code using ESLint
