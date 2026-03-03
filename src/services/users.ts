import { desc, eq } from 'drizzle-orm';
import { db } from '../db/db';
import { defaultSearchEngines, events, users, type Shortcut } from '../db/schema';
import removeTelegramHTML from '../utils/removeTelegramHTML';
const ADMIN_IDS = process.env.ADMIN_IDS;

export function getAdmins() {
	const admins = ADMIN_IDS?.split(',') || [];
	return admins;
}

export async function getUserData(userID: number) {
	const userData = await db
		.select()
		.from(users)
		.where(eq(users.id, userID))
		.limit(1)
		.then((rows) => rows[0]);

	return userData;
}

export async function getUserEvents(userID: number) {
	const eventsData = await db.select().from(events).where(eq(events.user_id, userID)).orderBy(desc(events.created_at));

	return eventsData;
}

export async function getUserShortcuts(
	userID: number,
	type?: 'both'
): Promise<Record<'shortcut' | 'slash_shortcut', Shortcut>>;
export async function getUserShortcuts(userID: number, type?: 'regular' | 'slash'): Promise<Shortcut>;
export async function getUserShortcuts(userID: number, type: 'regular' | 'slash' | 'both' = 'both') {
	const userShortcuts = await db
		.select({
			shortcut: users.shortcut,
			slash_shortcut: users.slash_shortcut
		})
		.from(users)
		.where(eq(users.id, userID))
		.limit(1)
		.then((rows) => rows[0]);

	if (type == 'both') return userShortcuts ?? { shortcut: 'meanings', slash_shortcut: 'meanings' };
	return type == 'slash' ? (userShortcuts?.slash_shortcut ?? 'meanings') : (userShortcuts?.shortcut ?? 'meanings');
}

type SearchEngine = { name: string; url: string; id?: string };
export async function getUserSearchEngines(userID: number): Promise<SearchEngine[]> {
	const userSearchEngines = await db
		.select({ search_engines: users.search_engines })
		.from(users)
		.where(eq(users.id, userID))
		.limit(1)
		.then((rows) => rows[0]);

	return (userSearchEngines?.search_engines as SearchEngine[]) || defaultSearchEngines;
}

export async function saveUserLastUse(
	userID: number,
	event?: {
		type: string;
		metadata?: string;
	}
) {
	const now = new Date();
	await db
		.insert(users)
		.values({ id: userID, last_use_at: now })
		.onConflictDoUpdate({
			target: users.id,
			set: { last_use_at: now }
		});

	if (event) await db.insert(events).values({ user_id: userID, ...event });
}

export async function saveUserShortcuts(userID: number, slash: boolean, newValue: Shortcut) {
	const valueToChange = slash ? { slash_shortcut: newValue } : { shortcut: newValue };

	return await db
		.insert(users)
		.values({ id: userID, ...valueToChange })
		.onConflictDoUpdate({
			target: users.id,
			set: valueToChange
		})
		.returning({ slash_shortcut: users.slash_shortcut, shortcut: users.shortcut })
		.then((rows) => rows[0]);
}

export async function saveUserSearchEngines(userID: number, searchEngines: SearchEngine[]) {
	const sanitizedSearchEngines = searchEngines.map((e) => ({
		...e,
		name: removeTelegramHTML(e.name).substring(0, 33) || Date.now().toString()
	}));

	return await db
		.insert(users)
		.values({ id: userID, search_engines: sanitizedSearchEngines })
		.onConflictDoUpdate({
			target: users.id,
			set: { search_engines: sanitizedSearchEngines }
		})
		.returning({ search_engines: users.search_engines })
		.then((rows) => rows[0]?.search_engines as SearchEngine[]);
}

export async function saveUserSearchEngine(userID: number, { url, name, id }: SearchEngine) {
	let searchEngines = await getUserSearchEngines(userID);

	try {
		new URL(url);
	} catch (e) {
		throw 'Invalid URL.';
	}
	if (!url.includes('$')) throw 'Missing $.';

	const alreadyAddedIndex = searchEngines.findIndex((e) => e.id == id);
	if (alreadyAddedIndex == -1) {
		id = crypto.randomUUID();
		searchEngines.push({ name, url, id });
	} else {
		searchEngines[alreadyAddedIndex] = { name, url, id };
	}

	const savedSearchEngines = await saveUserSearchEngines(userID, searchEngines);
	return savedSearchEngines.find((e) => e.id == id);
}

export async function deleteUserSearchEngine(userID: number, name: string) {
	const searchEngines = await getUserSearchEngines(userID);
	const filteredSearchEngines = searchEngines.filter((e) => e.name != name);

	return await saveUserSearchEngines(userID, filteredSearchEngines);
}

export async function deleteUser(userID: number) {
	return await db
		.delete(users)
		.where(eq(users.id, userID))
		.returning()
		.then((rows) => rows[0]);
}
