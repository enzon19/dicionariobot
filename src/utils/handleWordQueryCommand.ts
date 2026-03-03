import type { StatelessQuestion } from '@grammyjs/stateless-question';
import type { BotContext } from '../bot/bot';
import { sendLastAd } from '../services/ads';
import { buildWaitingReplyMessage } from './messagesBuilders';

export async function handleWordQueryCommand(
	ctx: BotContext,
	buildMessage: (word: string, userID: number) => Promise<string>,
	statelessQuestion: StatelessQuestion<BotContext>,
	commandName: 'definir' | 'sinônimos' | 'exemplos'
) {
	try {
		await sendLastAd(ctx);
	} catch (e) {
		console.error('Error sending ads:', e);
	}

	if (!ctx.match) {
		ctx.reply(buildWaitingReplyMessage(commandName) + statelessQuestion.messageSuffixHTML(), {
			parse_mode: 'HTML',
			reply_markup: {
				force_reply: true,
				selective: true,
				input_field_placeholder: 'Escrever uma palavra...'
			}
		});
	} else {
		const word = ctx.match.toString();
		await replyWithWordResult(ctx, buildMessage, word);
	}
}

export async function replyWithWordResult(
	ctx: BotContext,
	buildMessage: (word: string, userID: number) => Promise<string>,
	word: string
) {
	await ctx.replyWithChatAction('typing');
	const result = await buildMessage(word, ctx.from?.id || 0);

	await ctx.reply(result, {
		parse_mode: 'HTML',
		link_preview_options: { is_disabled: true }
	});
}
