import type { BotContext } from '../bot';
import { Command } from '../../models/Command';
import { buildWaitingReplyMessage } from '../../utils/messagesBuilders';
import getSynonymsMessage from '../messages/synonymsMessage';
import { SynonymsQuestion } from '../questions/Synonyms';
import { sendLastAd } from '../../services/ads';

export class SynonymsCommand extends Command {
	name = 'Sinônimos de Palavras';
	commands = ['sinonimos', 'sinônimo', 'sinônimos', 'sinonimo'];
	description = 'Receba uma lista de sinônimos de uma palavra.';
	args = '[palavra]';
	example = '/sinonimos dicionário';
	saveUserData = true;

	handle = async (ctx: BotContext) => {
		await sendLastAd(ctx);
		
		if (!ctx.match) {
			ctx.reply(buildWaitingReplyMessage('sinônimos') + SynonymsQuestion.messageSuffixHTML(), {
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
			const synonyms = await getSynonymsMessage(word);

			await ctx.reply(synonyms, {
				parse_mode: 'HTML'
			});
		}
	};
}
