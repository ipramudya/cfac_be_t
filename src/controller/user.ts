import { parseAndValidate } from '@/utils'
import * as validation from '@/validation'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'

export async function register(req: Request, res: Response, next: NextFunction) {
  const parsedReq = await parseAndValidate(validation.register, req, next)

  if (parsedReq) {
    res.status(status.OK).json(parsedReq)
  }
}
