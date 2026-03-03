import type { BotContext } from '../bot';
import { Command } from '../../models/Command';
import getMeaningMessage from '../messages/meaningMessage';
import { MeaningsQuestion } from '../questions/Meanings';
import { handleWordQueryCommand } from '../../utils/handleWordQueryCommand';

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

	handle = async (ctx: BotContext) => {
		handleWordQueryCommand(ctx, getMeaningMessage, MeaningsQuestion, 'definir');
	};
}
