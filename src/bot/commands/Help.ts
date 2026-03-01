import type { BotContext } from '../bot';
import { Command } from '../../models/Command';
import { Menu } from '@grammyjs/menu';
import { commands } from '.';
import { buildCommandsMenus, buildFaqMenus, buildHelpMainMenu } from '../menus/helpMenus';
import { mainMenuText } from '../messages/helpMessages';

export class HelpCommand extends Command {
	name = 'Ajuda';
	commands = ['help', 'ajuda'];
	description = 'Saiba mais sobre todos os comandos do bot ou veja as perguntas frequentes.';
	saveUserData = true;

	menus = (short: boolean = false) => {
		const publicCommands = commands.filter((e) => !e.admin);
		const main = buildHelpMainMenu(publicCommands);
		if (short) return main;

		const { faqMenu, allFaqSubmenus } = buildFaqMenus();
		main.register(faqMenu);
		for (const submenu of allFaqSubmenus) {
			main.register(submenu);
		}

		const { commandsMenu, allCommandsSubmenus } = buildCommandsMenus(publicCommands);
		main.register(commandsMenu);
		for (const submenu of allCommandsSubmenus) {
			main.register(submenu);
		}

		return [main];
	};

	handle = (ctx: BotContext) => {
		ctx.reply(mainMenuText, {
			parse_mode: 'HTML',
			link_preview_options: {
				is_disabled: true
			},
			reply_markup: this.menus(true) as Menu<BotContext>
		});
	};
}
