import { HTTPException, createHashedPassword, parseAndValidate } from '@/api/utils'
import * as validation from '@/api/validation'
import { db, generateToken, logger } from '@/lib'
import { userTable } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status-codes'
import { DatabaseError } from 'pg'
import { v4 as uuid } from 'uuid'

export async function register(req: Request, res: Response, next: NextFunction) {
  const validatedReq = await parseAndValidate(validation.register, req, next)
  if (!validatedReq) return

  try {
    const hashedPassword = await createHashedPassword(validatedReq.body.password)
    const userData = {
      id: uuid(),
      username: validatedReq.body.username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(userTable).values(userData)
    res.status(status.CREATED).send()
  } catch (error) {
    if (error instanceof DatabaseError && error.constraint === 'users_username_unique') {
      return next(new HTTPException(status.BAD_REQUEST, 'Username already exists'))
    }
    return next(new Error('Failed to register user'))
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

      res.status(status.OK).json({ token, user: omit(user, ['password', 'updatedAt']) })
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
        return next(new HTTPException(status.UNAUTHORIZED, 'Invalid password'))
      }

      const hashedPwd = await createHashedPassword(body.newPassword)

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
