import type { Bot, Context } from 'grammy';
import type { Command } from '../../models/Command';
import { StartCommand } from './Start';
import { MeaningCommand } from './Meaning';

const commands: Command[] = [new StartCommand(), new MeaningCommand()];

export function registerCommands(bot: Bot<Context>): void {
	for (const command of commands) {
		if (command.menus) {
			for (const menu of command.menus()) {
				bot.use(menu);
			}
		}

		command.register(bot);
	}
}
