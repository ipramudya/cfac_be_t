import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}

export const userTable = pgTable('users', {
  id: uuid().primaryKey().notNull(),
  username: varchar({ length: 256 }).notNull().unique(),
  password: varchar({ length: 500 }).notNull(),
  ...timestamps,
})
