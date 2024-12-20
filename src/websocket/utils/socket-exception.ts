export interface SocketException extends Error {
  data?: any
  code?: string
}

export class SocketException extends Error {
  constructor(message: string, code?: string, data?: any) {
    super(message)
    this.name = 'SocketError'
    this.code = code
    this.data = data
  }
}
