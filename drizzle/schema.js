import { pgTable, uuid, text, timestamp, boolean, integer, bigint } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  profilePicture: text('profile_picture'),
  verificationToken: text('verification_token'),
  verificationTokenExpires: timestamp('verification_token_expires'),
  isVerified: boolean('is_verified').default(false),
  isAdmin: boolean('is_admin').default(false),
  resetToken: text('reset_token'),
  resetTokenExpires: timestamp('reset_token_expires')
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isPublished: boolean('is_published').default(true),
  viewCount: integer('view_count').default(0),
  slug: text('slug').notNull().unique()
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  eventType: text('event_type').notNull(),
  isPublic: boolean('is_public').default(true)
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  isRead: boolean('is_read').default(false)
});

export const uploads = pgTable('uploads', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  uploadType: text('upload_type').notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull()
});

export const matches = pgTable('matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  opponent: text('opponent').notNull(),
  matchDate: timestamp('match_date').notNull(),
  matchResult: text('match_result'),
  ourScore: integer('our_score'),
  opponentScore: integer('opponent_score'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id, { onDelete: 'cascade' })
});