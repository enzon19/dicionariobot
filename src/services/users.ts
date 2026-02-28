import { db } from '../db/db';
import { events, users } from '../db/schema';

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
