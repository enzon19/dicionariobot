import type { BotContext } from '../bot';
import { Command } from '../../models/Command';
import getSentencesMessage from '../messages/sentencesMessage';
import { SentencesQuestion } from '../questions/Sentences';
import { handleWordQueryCommand } from '../../utils/handleWordQueryCommand';

export class SentencesCommand extends Command {
	name = 'Exemplos para Palavras';
	commands = ['exemplos', 'exemplo', 'exemplificar', 'frases', 'frase'];
	description = 'Receba frases exemplificando o uso de uma palavra.';
	args = '[palavra]';
	example = '/exemplos dicionário';
	saveUserData = true;

	handle = async (ctx: BotContext) => {
		handleWordQueryCommand(ctx, getSentencesMessage, SentencesQuestion, 'exemplos');
	};
}
