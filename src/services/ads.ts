import { desc, eq } from 'drizzle-orm';
import type { BotContext } from '../bot/bot';
import { db } from '../db/db';
import { campaigns, users } from '../db/schema';

export async function sendLastAd(ctx: BotContext) {
	if (!ctx.from) return;
	const userID = ctx.from.id;

	const userAlreadyReceivedCampaign = await db
		.select({
			received_last_ad: users.received_last_ad
		})
		.from(users)
		.where(eq(users.id, userID))
		.limit(1)
		.then((rows) => rows[0]?.received_last_ad);
	if (userAlreadyReceivedCampaign) return;

	const lastCampaign = await db
		.select()
		.from(campaigns)
		.orderBy(desc(campaigns.created_at))
		.limit(1)
		.then((rows) => rows[0]);
	if (!lastCampaign) return;

	if (lastCampaign.photo) {
		await ctx.replyWithPhoto(lastCampaign.photo, {
			caption: lastCampaign.text || undefined,
			...(lastCampaign.message_options || {})
		});
	} else if (lastCampaign.text) {
		await ctx.reply(lastCampaign.text, lastCampaign.message_options || {});
	}

	await db
		.insert(users)
		.values({ id: userID, received_last_ad: true })
		.onConflictDoUpdate({
			target: users.id,
			set: { received_last_ad: true }
		});
}
