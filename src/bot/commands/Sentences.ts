import type { Context } from 'grammy';
import { Command } from '../../models/Command';
import { buildWaitingReplyMessage } from '../../utils/messagesBuilders';
import getSentencesMessage from '../messages/sentencesMessage';

export class SentencesCommand extends Command {
	name = 'Exemplos para Palavras';
	commands = ['exemplos', 'exemplo', 'exemplificar', 'frases', 'frase'];
	description = 'Receba frases exemplificando o uso de uma palavra.';
	args = '[palavra]';
	example = '/exemplos dicionário';
	saveUserData = true;

	handle = async (ctx: Context) => {
		if (!ctx.match) {
			ctx.reply(buildWaitingReplyMessage('exemplos'), {
				parse_mode: 'HTML',
				reply_markup: {
					force_reply: true,
					selective: true,
					input_field_placeholder: 'Escrever uma palavra...'
				}
			});
		} else {
			const word = ctx.match.toString();

			await ctx.replyWithChatAction('typing');
			const sentences = await getSentencesMessage(word);

			await ctx.reply(sentences, {
				parse_mode: 'HTML'
			});
		}
	};
}
