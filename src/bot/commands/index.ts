import type { Bot } from 'grammy';
import type { Command } from '../../models/Command';
import type { BotContext } from '../bot';
import { StartCommand } from './Start';
import { MeaningCommand } from './Meanings';
import { SynonymsCommand } from './Synonyms';
import { SentencesCommand } from './Sentences';
import { SettingsCommand } from './Settings';
import { HelpCommand } from './Help';
import { CancelCommand } from './Cancel';
import { DonateCommand } from './Donate';
import { AboutCommand } from './About';
import { PingCommand } from './Ping';

export const commands: Command[] = [
	new StartCommand(),
	new MeaningCommand(),
	new SynonymsCommand(),
	new SentencesCommand(),
	new SettingsCommand(),
	new HelpCommand(),
	new CancelCommand(),
	new DonateCommand(),
	new AboutCommand(),
	new PingCommand()
];

export function registerCommands(bot: Bot<BotContext>): void {
	for (const command of commands) {
		command.register(bot);
	}
}

export function registerMenus(bot: Bot<BotContext>): void {
	for (const command of commands) {
		if (command.menus) {
			const menus = typeof command.menus === 'function' ? command.menus() : command.menus;
			const menuArray = Array.isArray(menus) ? menus : [menus];
			for (const menu of menuArray) {
				bot.use(menu);
			}
		}
	}
}
