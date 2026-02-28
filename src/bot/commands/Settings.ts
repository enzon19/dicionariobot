import type { Context } from 'grammy';
import type { ParseMode } from 'grammy/types';
import type { Shortcut } from '../../db/schema';
import { Command } from '../../models/Command';
import { Menu } from '@grammyjs/menu';
import { getUserShortcuts, saveUserShortcuts } from '../../services/users';

const editMessageOptions = { parse_mode: 'HTML' as ParseMode };
const mainMenuText =
	'<u><b>CONFIGURAÇÕES</b></u>\n\nConfigure os atalhos do chat privado, gerencie mecanismos de busca e saiba quais dados são armazenados pelo bot.';

// SHORTCUTS
const shortcutNameInPortuguese = {
	meanings: 'definições da palavra',
	synonyms: 'sinônimos da palavra',
	sentences: 'exemplos da palavra'
} as const;

async function shortcutsMenuText(userID: number) {
	const userShortcuts = await getUserShortcuts(userID);

	return `<u><b>CONFIGURAÇÕES > ATALHOS</b></u>\n\nOs atalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função. \n\nEscolha um tipo de atalho para configurar. Saiba mais no comando /ajuda.\n\n<b>Atalho sem /:</b> ${shortcutNameInPortuguese[userShortcuts.shortcut]}\n<b>Atalho com /:</b> ${shortcutNameInPortuguese[userShortcuts.slash_shortcut]}`;
}

const changeShortcutsMenuText = (slash: boolean) =>
	`<u><b>CONFIGURAÇÕES > ATALHOS > ${slash ? 'COM' : 'SEM'} /</b></u>\n\nAtalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função.\n\nEscolha uma função para o <b>atalho ${slash ? 'com' : 'sem'} /</b>:`;
function buildChangeShortcut(id: string, slash: boolean) {
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
		.back('⬅️ Voltar', async (ctx) =>
			ctx.editMessageText(await shortcutsMenuText(ctx.from.id), editMessageOptions)
		);
}

// DATA

export class SettingsCommand extends Command {
	name = 'Configurações';
	commands = ['settings', 'ajustes', 'configuracoes', 'configurações'];
	description =
		'Configure os atalhos do chat privado, gerencie mecanismos de busca e saiba quais dados são armazenados pelo bot.';
	saveUserData = true;

	menus = (short: boolean = false) => {
		const main = new Menu('settings-main-menu')
			.submenu('Atalhos', 'shortcuts-menu', async (ctx) =>
				ctx.editMessageText(await shortcutsMenuText(ctx.from.id), editMessageOptions)
			)
			.row()
			.submenu('Mecanismos de Busca', 'engines-menu')
			.row()
			.submenu('Dados Armazenados', 'data-menu');
		if (short) return main;

		// SHORTCUTS
		const shortcutsMenu = new Menu('shortcuts-menu')
			.submenu('Atalho sem /', 'regular-shortcut', (ctx) =>
				ctx.editMessageText(changeShortcutsMenuText(false), editMessageOptions)
			)
			.submenu('Atalho com /', 'slash-shortcut', (ctx) =>
				ctx.editMessageText(changeShortcutsMenuText(true), editMessageOptions)
			)
			.row()
			.back('⬅️ Voltar', (ctx) => ctx.editMessageText(mainMenuText, editMessageOptions));
		const regularShortcut = buildChangeShortcut('regular-shortcut', false);
		const slashShortcut = buildChangeShortcut('slash-shortcut', true);

		shortcutsMenu.register(regularShortcut);
		shortcutsMenu.register(slashShortcut);
		main.register(shortcutsMenu);

		// ENGINES
		
		// DATA

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
