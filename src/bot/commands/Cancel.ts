import type { BotContext } from '../bot';
import { Command } from '../../models/Command';

export class CancelCommand extends Command {
	name = 'Cancelar';
	commands = ['cancelar', 'cancel', 'close', 'fechar', 'quit', 'sair'];
	description = 'Cancele uma operação do bot.';
	saveUserData = true;

	handle(ctx: BotContext): void {
		ctx.session.settings.searchEngines.editing = {};

		ctx.reply('Operação cancelada.', {
			reply_markup: {
				remove_keyboard: true
			}
		});
	}
}
