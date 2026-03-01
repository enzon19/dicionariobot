import type { Context } from 'grammy';
import { Command } from '../../models/Command';
import { Menu } from '@grammyjs/menu';
import { buildChangeShortcut, buildShortcutMenu } from '../menus/settings/shortcutsMenus';
import { mainMenuText } from '../messages/helpMessages';
import { buildSettingsMainMenu } from '../menus/settings';

export class SettingsCommand extends Command {
	name = 'Configurações';
	commands = ['settings', 'ajustes', 'configuracoes', 'configurações'];
	description =
		'Configure os atalhos do chat privado, gerencie mecanismos de busca e saiba quais dados são armazenados pelo bot.';
	saveUserData = true;

	menus = (short: boolean = false) => {
		const main = buildSettingsMainMenu();
		if (short) return main;

		const shortcutsMenu = buildShortcutMenu();
		const regularShortcut = buildChangeShortcut('regular-shortcut', false);
		const slashShortcut = buildChangeShortcut('slash-shortcut', true);
		shortcutsMenu.register(regularShortcut);
		shortcutsMenu.register(slashShortcut);
		main.register(shortcutsMenu);

		return [main];
	};

	handle(ctx: Context): void {
		ctx.reply(mainMenuText, {
			parse_mode: 'HTML',
			link_preview_options: {
				is_disabled: true
			},
			reply_markup: this.menus(true) as Menu
		});
	}
}
