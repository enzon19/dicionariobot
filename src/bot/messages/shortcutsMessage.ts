import type { Context } from 'grammy';
import { type Shortcut } from '../../db/schema';
import getMeaningMessage from '../messages/meaningMessage';
import getSynonymsMessage from '../messages/synonymsMessage';
import getSentencesMessage from '../messages/sentencesMessage';
import { getUserShortcuts } from '../../services/users';

export async function buildShortcutMessage(ctx: Context, text: string, slash: boolean) {
	if (!ctx.from) return;

	await ctx.replyWithChatAction('typing');

	const handlers: Record<Shortcut, (word: string, userID: number) => Promise<string>> = {
		meanings: getMeaningMessage,
		synonyms: getSynonymsMessage,
		sentences: getSentencesMessage
	};

	const userChosenShortcut = await getUserShortcuts(ctx.from.id, slash ? 'slash' : 'regular');

	const result = await handlers[userChosenShortcut](text, ctx.from.id);
	return result;
}
