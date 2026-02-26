import type { Bot, Context } from 'grammy';
import type { Command } from '../../models/Command';
import { StartCommand } from './Start';
import { MeaningCommand } from './Meanings';
import { SynonymsCommand } from './Synonyms';
import { SentencesCommand } from './Sentences';
import { CancelCommand } from './Cancel';
import { DonateCommand } from './Donate';
import { AboutCommand } from './About';
import { PingCommand } from './Ping';

const commands: Command[] = [
	new StartCommand(),
	new MeaningCommand(),
	new SynonymsCommand(),
	new SentencesCommand(),
	new CancelCommand(),
	new DonateCommand(),
	new AboutCommand(),
	new PingCommand()
];

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
