import type { Context } from 'grammy';
import { Command } from '../../models/Command';
import getMeaningMessage from '../messages/meaningMessage';
import { buildWaitingReplyMessage } from '../../utils/messagesBuilders';

export class MeaningCommand extends Command {
	name = 'Definição de Palavras';
	commands = [
		'definir',
		'definicoes',
		'definicao',
		'definições',
		'definição',
		'definiçoes',
		'definiçao',
		'significado',
		'significados'
	];
	description =
		'Receba as definições de acordo com as várias classes de palavras que uma palavra pode exercer, a separação silábica e uma pequena etimologia.';
	args = '[palavra]';
	example = '/definir dicionário';
	saveUserData = true;

	handle = async (ctx: Context) => {
		if (!ctx.match) {
			ctx.reply(buildWaitingReplyMessage('definir'), {
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
			const meanings = await getMeaningMessage(word);

			await ctx.reply(meanings, {
				parse_mode: 'HTML'
			});
		}
	};
}
