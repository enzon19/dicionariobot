import type { Context, FilterQuery } from 'grammy';
import { Listener } from '../../models/Listener';
import type { Message } from 'grammy/types';
import { buildWaitingReplyMessage } from '../../utils/messagesBuilders';
import removeTelegramHTML from '../../utils/removeTelegramHTML';
import getMeaningMessage from '../messages/meaningMessage';
import getSynonymsMessage from '../messages/synonymsMessage';
import getSentencesMessage from '../messages/sentencesMessage';
import { saveLastUse } from '../../services/users';
const BOT_USERNAME = process.env.BOT_USERNAME;

export class TextListener extends Listener {
	listenerName = 'text-message';
	on: FilterQuery[] = ['message:text', 'message:caption'];
	saveUserData = false;

	handle = async (ctx: Context) => {
		const message = ctx.message;
		const text = message?.text || message?.caption;
		if (!text) return;

		if (message.reply_to_message?.text && message.reply_to_message.from?.username == BOT_USERNAME) {
			// if it has reply_to_message from bot, so it could be the empty message from a command
			await handleReply(message, text, ctx);
			if (ctx.from) await saveLastUse(ctx.from.id, { type: 'event:' + this.on.join(',') });
		} else if (message.chat.type == 'private') {
			// if it's from a private chat, it's a shortcut
			console.log('shortcut');
			if (ctx.from) await saveLastUse(ctx.from.id, { type: 'event:' + this.on.join(',') });
		} else if (message.chat.type == 'group' || message.chat.type == 'supergroup') {
			// if it's from a group, check for mistakes
			console.log('check for mistakes');
		}
	};
}

async function handleReply(message: Message, text: string, ctx: Context) {
	const repliedMessageText = message.reply_to_message?.text;

	// could be asking for a word for meanings, synonyms, sentences
	const waitingReplyMessage = removeTelegramHTML(buildWaitingReplyMessage('').slice(0, -2));
	if (repliedMessageText?.startsWith(waitingReplyMessage)) {
		await handleWordRequest(message, text, ctx, repliedMessageText, waitingReplyMessage.length + 1);
	}
}

type WordAction = 'definir' | 'sinônimos' | 'exemplos';
async function handleWordRequest(
	message: Message,
	text: string,
	ctx: Context,
	repliedMessageText: string,
	start: number
) {
	const action = repliedMessageText.slice(start, -1) as WordAction;

	const handlers: Record<WordAction, (word: string) => Promise<string>> = {
		definir: getMeaningMessage,
		sinônimos: getSynonymsMessage,
		exemplos: getSentencesMessage
	};

	ctx.replyWithChatAction('typing');
	const result = await handlers[action](text);

	ctx.reply(result, {
		parse_mode: 'HTML',
		reply_parameters: message && {
			message_id: message?.message_id
		}
	});
}
