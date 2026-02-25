import type { Bot, Context } from 'grammy';
import type { Command } from '../../models/Command';
import { StartCommand } from './Start';

const commands: Command[] = [new StartCommand()];

export function registerCommands(bot: Bot<Context>): void {
	for (const command of commands) {
		if (command.menu) {
			bot.use(command.menu);
		}

		command.register(bot);
	}
}
