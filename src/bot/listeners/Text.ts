import type { Context, FilterQuery } from 'grammy';
import { type Shortcut } from '../../db/schema';
import { Listener } from '../../models/Listener';
import getMeaningMessage from '../messages/meaningMessage';
import getSynonymsMessage from '../messages/synonymsMessage';
import getSentencesMessage from '../messages/sentencesMessage';
import { getUserShortcuts, saveUserLastUse } from '../../services/users';
import fs from 'fs';

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
		} else if (!message.from.is_bot && (message.chat.type == 'group' || message.chat.type == 'supergroup')) {
			// if it's from a group and user is not a bot, check for mistakes
			if ((await checkForMistakes(ctx, text)) && ctx.from)
				await saveUserLastUse(ctx.from.id, {
					type: this.listenerName + ':mistakes'
				});
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

// CHECK FOR MISTAKES
type Mistake = {
	wrong: string;
	right: string;
};
const mistakesList: Mistake[] = JSON.parse(fs.readFileSync('public/mistakes.json', 'utf-8'));
const mistakeMap = new Map(mistakesList.map((m) => [m.wrong, m.right]));

async function checkForMistakes(ctx: Context, text: string) {
	const normalizedText = text
		.toLowerCase()
		.replace(/[\p{P}]/gu, '')
		.trim();
	const words = normalizedText.split(/\s+/).filter((e) => e);

	const corrections = new Set<string>();

	for (const word of words) {
		const correction = mistakeMap.get(word);
		if (correction) corrections.add(correction + '*');
	}

	if (corrections.size == 0) return false;

	await ctx.reply([...corrections].join('\n'));
	return true;
}
