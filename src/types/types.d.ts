import type { Socket } from 'socket.io'

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & JwtPayloadData
    }
  }

  type AuthenticatedSocket = Socket & {
    request: {
      headers: {
        authorization?: string
      }
      auth?: JwtPayload & JwtPayloadData
    }
  }

  export type JwtPayloadData = {
    userId: string
    username: string
  }
}
