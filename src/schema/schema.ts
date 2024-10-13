import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
// import { createSchema } from 'drizzle-orm/pg';
export const genderEnum = pgEnum("gender", ["male", "female", "others"]);
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 10 }).notNull(),
  city: varchar({ length: 30 }).notNull(),
  gender: genderEnum(),
  isIphone: boolean().notNull(),
  created: timestamp().defaultNow(),
});

export const notes = pgTable("notes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").references(() => usersTable.id),
  title: varchar({}).notNull(),
  text: varchar({}).notNull(),
  created: timestamp().defaultNow(),
});
