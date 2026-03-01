import { Menu, MenuRange } from '@grammyjs/menu';
import {
	editSearchEngineMenuText,
	searchEnginesMenuText,
	mainMenuText,
	setSearchEngineNameText,
	setSearchEngineURLText
} from '../../messages/settingsMessages';
import { editMessageOptions } from '.';
import { getUserSearchEngines } from '../../../services/users';

export function buildSearchEnginesMenu() {
	return new Menu('search-engines-menu')
		.dynamic(async (ctx) => {
			if (!ctx.from) return;
			const userSearchEngines = await getUserSearchEngines(ctx.from.id);

			const searchEnginesRange = new MenuRange();
			for (let i = 0; i < userSearchEngines.length; i++) {
				const searchEngine = userSearchEngines[i];
				if (!searchEngine) continue;

				searchEnginesRange.submenu(searchEngine.name, 'edit-search-engine-menu', (ctx) =>
					ctx.editMessageText(editSearchEngineMenuText(searchEngine.name, searchEngine.url), editMessageOptions)
				);

				if (i % 2) searchEnginesRange.row();
			}
			return searchEnginesRange;
		})
		.row()
		.text('➕ Adicionar Mecanismo de Busca')
		.row()
		.back('⬅️ Voltar', (ctx) => ctx.editMessageText(mainMenuText, editMessageOptions));
}

export function buildEditSearchEnginesMenu() {
	const replyOptions = {
		parse_mode: 'HTML',
		reply_markup: {
			force_reply: true,
			selective: true
		}
	} as any;

	return new Menu('edit-search-engine-menu')
		.text('Editar nome', (ctx) => ctx.reply(setSearchEngineNameText, replyOptions))
		.text('Editar URL', (ctx) => ctx.reply(setSearchEngineURLText, replyOptions))
		.row()
		.submenu('Apagar permanentemente', 'delete-search-engine-menu')
		.row()
		.back('⬅️ Voltar', (ctx) => ctx.editMessageText(searchEnginesMenuText, editMessageOptions));
}

export function buildDeleteSearchEngineMenu() {
	return new Menu('delete-search-engine-menu')
		.submenu('Apagar permanentemente', 'search-engines-menu', async (ctx) => {
			// await deleteUser(ctx.from.id);
			ctx.editMessageText(searchEnginesMenuText, editMessageOptions);
		})
		.back('Cancelar', async (ctx) => ctx.editMessageText(editSearchEngineMenuText(name, url), editMessageOptions));
}
