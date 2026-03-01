import type { Context, FilterQuery } from 'grammy';
import { Listener } from '../../models/Listener';
import getMeaningMessage from '../messages/meaningMessage';
import getSynonymsMessage from '../messages/synonymsMessage';
import getSentencesMessage from '../messages/sentencesMessage';
import { getUserShortcuts, saveUserLastUse } from '../../services/users';
import { type Shortcut } from '../../db/schema';

export class TextListener extends Listener {
	listenerName = 'text-message';
	on: FilterQuery[] = ['message:text', 'message:caption'];
	saveUserData = false;

	handle = async (ctx: Context) => {
		const message = ctx.message;
		const text = message?.text || message?.caption;
		if (!text) return;

		if (message.chat.type == 'private') {
			// if it's from a private chat, it's a shortcut
			const isSlashShortcut = text.startsWith('/');
			await shortcut(ctx, text, isSlashShortcut);

			if (ctx.from)
				await saveUserLastUse(ctx.from.id, {
					type: this.listenerName + (isSlashShortcut ? ':slash-shortcut' : ':shortcut')
				});
		} else if (message.chat.type == 'group' || message.chat.type == 'supergroup') {
			// if it's from a group, check for mistakes
			console.log('check for mistakes');
		}
	};
}

// SHORTCUT

async function shortcut(ctx: Context, text: string, slash: boolean) {
	if (!ctx.from) return;

	await ctx.replyWithChatAction('typing');

	const handlers: Record<Shortcut, (word: string) => Promise<string>> = {
		meanings: getMeaningMessage,
		synonyms: getSynonymsMessage,
		sentences: getSentencesMessage
	};

	const userChosenShortcut = await getUserShortcuts(ctx.from.id, slash ? 'slash' : 'regular');

	const result = await handlers[userChosenShortcut](text);
	ctx.reply(result, {
		parse_mode: 'HTML'
	});
}
