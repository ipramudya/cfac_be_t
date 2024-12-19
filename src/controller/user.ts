import { HASH_SALT } from '@/constant'
import { db, generateToken, logger } from '@/lib'
import { userTable } from '@/lib/db/schema'
import { HTTPException, parseAndValidate } from '@/utils'
import * as validation from '@/validation'
import bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'
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

      res.status(status.CREATED).json(omit(values, ['password']))
    } catch (error) {
      logger.debug({ error })

      if (error instanceof DatabaseError && error.constraint === 'users_username_unique') {
        return next(new HTTPException(status.BAD_REQUEST, 'Username already exists'))
      }

      return next(new Error('Failed to register user'))
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const parsedReq = await parseAndValidate(validation.login, req, next)

  if (parsedReq) {
    const { body } = parsedReq

    try {
      const [user] = await db
        .select()
        .from(userTable)
        .where(sql`username = ${body.username}`)

      if (!user) {
        return next(new HTTPException(status.UNAUTHORIZED, 'Invalid username or password'))
      }

      const isPassValid = await bcrypt.compare(body.password, user.password)

      if (!isPassValid) {
        return next(new HTTPException(status.UNAUTHORIZED, 'Invalid username or password'))
      }

      const token = generateToken({
        userId: user.id,
        username: user.username,
      })

      res.status(status.OK).json({ token })
    } catch (error) {
      logger.debug({ error })
      return next(new Error('Failed to login user'))
    }
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  const parsedReq = await parseAndValidate(validation.changePassword, req, next)

  if (parsedReq) {
    const authPayload = req.auth!
    const { body } = parsedReq

    try {
      const [user] = await db
        .select()
        .from(userTable)
        .where(sql`id = ${authPayload.userId}`)

      const isPassValid = await bcrypt.compare(body.oldPassword, user.password)

      if (!isPassValid) {
        return next(new HTTPException(status.UNAUTHORIZED, 'Invalid username or password'))
      }

      const salt = await bcrypt.genSalt(HASH_SALT)
      const hashedPwd = bcrypt.hashSync(body.newPassword, salt)

      await db
        .update(userTable)
        .set({ password: hashedPwd, updatedAt: new Date() })
        .where(sql`id = ${authPayload.userId}`)

      res.status(status.NO_CONTENT).send()
    } catch (error) {
      logger.debug({ error })
      return next(new Error('Failed to change password'))
    }
  }
}
