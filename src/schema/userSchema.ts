import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
  age: integer("age").notNull(),
  isActive: boolean("isActive").default(false),
  timestamp3: timestamp("timestamp3").defaultNow(),
});
