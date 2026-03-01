import type { ParseMode } from 'grammy/types';
import { dataMenuText, shortcutsMenuText } from '../../messages/settingsMessages';
import { Menu } from '@grammyjs/menu';

export const editMessageOptions = { parse_mode: 'HTML' as ParseMode };

export function buildSettingsMainMenu() {
	return new Menu('settings-main-menu')
		.submenu('Atalhos', 'shortcuts-menu', async (ctx) =>
			ctx.editMessageText(await shortcutsMenuText(ctx.from.id), editMessageOptions)
		)
		.row()
		.submenu('Mecanismos de Busca', 'engines-menu')
		.row()
		.submenu('Dados Armazenados', 'data-menu', async (ctx) =>
			ctx.editMessageText(await dataMenuText(ctx.from.id), editMessageOptions)
		);
}
