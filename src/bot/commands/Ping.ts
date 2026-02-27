import type { Context } from 'grammy';
import { Command } from '../../models/Command';

export class PingCommand extends Command {
	name = 'Ping';
	commands = ['ping'];
	description = 'Pong! 🏓';
	saveUserData = true;

	handle(ctx: Context): void {
		const message = ctx.message;

		ctx.reply('Pong! 🏓', {
			reply_parameters: message && {
				message_id: message?.message_id
			}
		});
	}
}
