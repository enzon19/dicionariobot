import type { Context } from 'grammy';
import { Command } from '../../models/Command';

export class CancelCommand extends Command {
	name = 'Cancelar';
	commands = ['cancelar', '/cancel', '/close', '/fechar', '/quit', '/sair'];
	description = 'Cancele uma operação do bot.';
	saveUserData = false;

	handle(ctx: Context): void {
		ctx.reply('Operação cancelada.', {
			reply_markup: {
				remove_keyboard: true
			}
		});
	}
}
