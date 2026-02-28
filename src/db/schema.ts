import { bigint, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const defaultSearchEngines = [
	{ name: 'Google', url: 'https://www.google.com/search?q=$' },
	{ name: 'Bing', url: 'https://www.bing.com/search?q=$' },
	{ name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=$' },
	{ name: 'Dicionário Informal', url: 'https://www.dicionarioinformal.com.br/$' },
	{ name: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Special:Search?search=$' }
];
export const shortcutEnum = pgEnum('shortcut', ['meanings', 'synonyms', 'sentences']);
export const users = pgTable('users', {
	id: bigint({ mode: 'number' }).primaryKey().notNull(),
	shortcut: shortcutEnum().default('meanings').notNull(),
	slash_shortcut: shortcutEnum().default('meanings').notNull(),
	search_engines: jsonb().default(defaultSearchEngines).notNull(),
	last_use_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
	created_at: timestamp({ withTimezone: true }).defaultNow().notNull()
});

export const events = pgTable('events', {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: bigint({ mode: 'number' }).references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	type: text().notNull(),
	metadata: text(),
	created_at: timestamp({ withTimezone: true }).defaultNow().notNull()
});
