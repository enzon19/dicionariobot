import type { Context } from 'grammy';
import { Command } from '../../models/Command';
import { buildWaitingReplyMessage } from '../../utils/messagesBuilders';
import getSynonymsMessage from '../messages/synonymsMessage';

export class SynonymsCommand extends Command {
	name = 'Sinônimos de Palavras';
	commands = ['sinonimos', 'sinônimo', 'sinônimos', 'sinonimo'];
	description =
		'Receba uma lista de sinônimos de uma palavra.';
	args = '[palavra]';
	example = '/sinonimos dicionário';
	saveUserData = true;

	handle = async (ctx: Context) => {
		const message = ctx.message;

		if (!ctx.match) {
			ctx.reply(buildWaitingReplyMessage('sinônimos'), {
				parse_mode: 'HTML',
				reply_parameters: message && {
					message_id: message?.message_id
				},
				reply_markup: {
					force_reply: true,
					selective: true,
					input_field_placeholder: 'Escrever palavra...'
				}
			});
		} else {
			const word = ctx.match.toString();

			ctx.replyWithChatAction('typing');
			const meanings = await getSynonymsMessage(word);

			ctx.reply(meanings, {
				parse_mode: 'HTML',
				reply_parameters: message && {
					message_id: message?.message_id
				}
			});
		}
	};
}
