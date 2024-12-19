import { HTTPException } from './http-exception'
import type { NextFunction, Request } from 'express'
import status from 'http-status-codes'
import { AnyZodObject, ZodEffects, ZodError, ZodIssue, z } from 'zod'

export async function parseAndValidate<T extends AnyZodObject | ZodEffects<AnyZodObject>>(
  schema: T,
  req: Request,
  next: NextFunction,
): Promise<z.infer<T> | void> {
  try {
    return await schema.parseAsync(req)
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = transformZodErrors(error.errors)
      return next(new HTTPException(status.BAD_REQUEST, 'Validation error', errors))
    }
    return next(new HTTPException(status.BAD_REQUEST, 'Something went wrong!'))
  }
}

type Validation = {
  field: string | number
  message: string
}

type TransformedData = {
  request: string
  validations: Validation[]
}

function transformZodErrors(errors: ZodIssue[]): TransformedData[] {
  const result: Record<string, Validation[]> = {}

  errors.forEach((error) => {
    const [request, field] = error.path

    if (!request || !field) return // Skip invalid paths

    // Initialize the request group if not already present
    if (!result[request]) {
      result[request] = []
    }

    // Push validation error for the field
    result[request].push({
      field,
      message: error.message,
    })
  })

  // Transform the result object into the desired array format
  return Object.entries(result).map(([request, validations]) => ({
    request,
    validations,
  }))
}
