import type { Context } from 'grammy';
import type { Shortcut } from '../../../db/schema';
import { Menu } from '@grammyjs/menu';
import { saveUserShortcuts } from '../../../services/users';
import { changeShortcutsMenuText, mainMenuText, shortcutsMenuText } from '../../messages/settingsMessages';
import { editMessageOptions } from '.';

export function buildChangeShortcut(id: string, slash: boolean) {
	const saveChangesAndGoBack = async (ctx: Context, slash: boolean, newShortcutValue: Shortcut) => {
		const userID = ctx.from!.id;

		await saveUserShortcuts(userID, slash, newShortcutValue);
		ctx.editMessageText(await shortcutsMenuText(userID), editMessageOptions);
	};

	return new Menu(id)
		.submenu('Definições', 'shortcuts-menu', (ctx) => saveChangesAndGoBack(ctx, slash, 'meanings'))
		.submenu('Sinônimos', 'shortcuts-menu', (ctx) => saveChangesAndGoBack(ctx, slash, 'synonyms'))
		.submenu('Exemplos', 'shortcuts-menu', (ctx) => saveChangesAndGoBack(ctx, slash, 'sentences'))
		.row()
		.back('⬅️ Voltar', async (ctx) => ctx.editMessageText(await shortcutsMenuText(ctx.from.id), editMessageOptions));
}

export function buildShortcutMenu() {
	return new Menu('shortcuts-menu')
		.submenu('Atalho sem /', 'regular-shortcut', (ctx) =>
			ctx.editMessageText(changeShortcutsMenuText(false), editMessageOptions)
		)
		.submenu('Atalho com /', 'slash-shortcut', (ctx) =>
			ctx.editMessageText(changeShortcutsMenuText(true), editMessageOptions)
		)
		.row()
		.back('⬅️ Voltar', (ctx) => ctx.editMessageText(mainMenuText, editMessageOptions));
}
