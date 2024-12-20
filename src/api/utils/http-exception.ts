type Data = Record<string, any> | Record<string, any>[]

export class HTTPException extends Error {
  status: number
  data?: Data

  constructor(status: number, message: string, data?: Data) {
    super(message)
    this.status = status
    this.data = data
  }
}
