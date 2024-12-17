import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}

export const users = pgTable('users', {
  id: uuid(),
  username: varchar({ length: 256 }).notNull(),
  password: varchar({ length: 500 }).notNull(),
  ...timestamps,
})
