import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createSchema } from 'drizzle-orm/pg';
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


// Posts Table
const posts = createSchema('posts', {
  id: integer('id').autoIncrement().primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: varchar('title', 100).notNull(),
  content: varchar('content', 2000).notNull(),
  createdAt: timestamp('created_at').defaultNow(),

  // Index on user_id to improve querying posts by user
  userPostsIndex: index(['user_id']),
});

// Comments Table
const comments = createSchema('comments', {
  id: integer('id').autoIncrement().primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id),
  userId: integer('user_id').notNull().references(() => users.id),
  content: varchar('content', 500).notNull(),
  createdAt: timestamp('created_at').defaultNow(),

  // Foreign Key constraints
  postFk: foreignKey(['post_id'], () => posts.id),
  userFk: foreignKey(['user_id'], () => users.id),

  // Composite Index for faster querying comments by post and user
  compositePostUserIndex: index(['post_id', 'user_id']),
});

// Tags Table
const tags = createSchema('tags', {
  id: integer('id').autoIncrement().primaryKey(),
  name: varchar('name', 50).notNull().unique(),
});

// PostTags Table (Many-to-Many Relationship between Posts and Tags)
const postTags = createSchema('post_tags', {
  postId: integer('post_id').notNull().references(() => posts.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),

  // Composite primary key to enforce uniqueness in the many-to-many relationship
  postTagPk: primaryKey(['post_id', 'tag_id']),
});

// Foreign Key and Index for optimization
const postTagForeignKey = foreignKey(['post_id', 'tag_id'], () => [posts.id, tags.id]);