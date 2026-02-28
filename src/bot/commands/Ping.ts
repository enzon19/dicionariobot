import type { Context } from 'grammy';
import { Command } from '../../models/Command';

export class PingCommand extends Command {
	name = 'Ping';
	commands = ['ping'];
	description = 'Pong! 🏓';
	saveUserData = true;

	handle(ctx: Context): void {
		ctx.reply('Pong! 🏓');
	}
}
