import type { BotContext } from '../bot';
import { Command } from '../../models/Command';
import getSynonymsMessage from '../messages/synonymsMessage';
import { SynonymsQuestion } from '../questions/Synonyms';
import { handleWordQueryCommand } from '../../utils/handleWordQueryCommand';

export class SynonymsCommand extends Command {
	name = 'Sinônimos de Palavras';
	commands = ['sinonimos', 'sinônimo', 'sinônimos', 'sinonimo'];
	description = 'Receba a lista de sinônimos de uma palavra.';
	args = '[palavra]';
	example = '/sinonimos dicionário';
	saveUserData = true;

	handle = async (ctx: BotContext) => {
		handleWordQueryCommand(ctx, getSynonymsMessage, SynonymsQuestion, 'sinônimos');
	};
}
