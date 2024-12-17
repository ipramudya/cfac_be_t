import { HASH_SALT } from '@/constant'
import { db, logger } from '@/lib'
import { userTable } from '@/lib/db/schema'
import { HttpError, parseAndValidate } from '@/utils'
import * as validation from '@/validation'
import bcrypt from 'bcryptjs'
import { omit } from 'es-toolkit'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'
import { DatabaseError } from 'pg'
import { v4 as uuid } from 'uuid'

export async function register(req: Request, res: Response, next: NextFunction) {
  const parsedReq = await parseAndValidate(validation.register, req, next)

  if (parsedReq) {
    const { body } = parsedReq

    try {
      const salt = await bcrypt.genSalt(HASH_SALT)
      const hashedPwd = bcrypt.hashSync(body.password, salt)

      const now = new Date()

      const values = {
        id: uuid(),
        username: body.username,
        password: hashedPwd,
        createdAt: now,
        updatedAt: now,
      }

      await db.insert(userTable).values(values)

      return res.status(status.CREATED).json(omit(values, ['password']))
    } catch (error) {
      logger.debug({ error })

      if (error instanceof DatabaseError && error.constraint === 'users_username_unique') {
        return next(new HttpError(status.BAD_REQUEST, 'Username already exists'))
      }

      return next(new Error('Failed to register user'))
    }
  }
}
