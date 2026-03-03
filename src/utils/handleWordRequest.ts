import type { ReplyToMessageContext } from '@grammyjs/stateless-question/dist/identifier';
import type { BotContext } from '../bot/bot';
import { saveUserLastUse } from '../services/users';
import { hasCancelCommand } from './hasCancelCommand';

export async function handleWordRequest(
	ctx: ReplyToMessageContext<BotContext>,
	buildMessage: (word: string) => Promise<string>,
	originalCommandName: string
) {
	const text = ctx.message?.text;
	if (!text) return;
	if (hasCancelCommand(ctx, text)) return;

	await ctx.replyWithChatAction('typing');
	const result = await buildMessage(text);

	ctx.reply(result, {
		parse_mode: 'HTML'
	});

	if (ctx.from?.id) await saveUserLastUse(ctx.from.id, { type: 'question:command:' + originalCommandName });
}
