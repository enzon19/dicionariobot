import type { ParseMode } from 'grammy/types';
import type { BotContext } from '../../bot';
import { dataMenuText, searchEnginesMenuText, shortcutsMenuText } from '../../messages/settingsMessages';
import { Menu } from '@grammyjs/menu';

export const editMessageOptions = { parse_mode: 'HTML' as ParseMode, link_preview_options: { is_disabled: true } };
export const replyOptions = {
	parse_mode: 'HTML',
	reply_markup: {
		force_reply: true,
		selective: true
	}
} as any;

export function buildSettingsMainMenu() {
	return new Menu<BotContext>('settings-main-menu')
		.submenu('Atalhos', 'shortcuts-menu', async (ctx) =>
			ctx.editMessageText(await shortcutsMenuText(ctx.from.id), editMessageOptions)
		)
		.row()
		.submenu('Mecanismos de Busca', 'search-engines-menu', async (ctx) =>
			ctx.editMessageText(searchEnginesMenuText, editMessageOptions)
		)
		.row()
		.submenu('Dados Armazenados', 'data-menu', async (ctx) =>
			ctx.editMessageText(await dataMenuText(ctx.from.id), editMessageOptions)
		);
}
