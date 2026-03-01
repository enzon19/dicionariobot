import { bigint, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const defaultSearchEngines = [
	{ name: 'Google', url: 'https://www.google.com/search?q=$', id: 'd7746574-28ce-4502-aa67-efe8325506fe' },
	{ name: 'Bing', url: 'https://www.bing.com/search?q=$', id: '9f018f13-1be7-4bb1-9f7b-844655ed5bb5' },
	{ name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=$', id: '7e94d6ec-c5ed-4238-98ba-4c5a2a95f4d0' },
	{
		name: 'Dicionário Informal',
		url: 'https://www.dicionarioinformal.com.br/$',
		id: '45e51a26-0d06-4d32-b52e-1687acb5c7d9'
	},
	{
		name: 'Wikipédia',
		url: 'https://pt.wikipedia.org/wiki/Special:Search?search=$',
		id: 'e479dbf2-bbf0-405c-b687-9f9c766f26dd'
	}
];
export type Shortcut = (typeof shortcutEnum.enumValues)[number];
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
