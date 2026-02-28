import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { events, shortcutEnum, users, type Shortcut } from '../db/schema';

export async function saveLastUse(
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
