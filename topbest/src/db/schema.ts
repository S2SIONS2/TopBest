import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  steamAppId: integer('steam_appid').notNull().unique(),
  name: text('name').notNull(),
  headerImage: text('header_image').notNull(),
  shortDescription: text('short_description'), // New column for game description
  recommendations: integer('recommendations').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
