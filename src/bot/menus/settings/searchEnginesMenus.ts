import type { BotContext } from '../../bot';
import { Menu, MenuRange } from '@grammyjs/menu';
import {
	editSearchEngineMenuText,
	searchEnginesMenuText,
	mainMenuText,
	setSearchEngineNameText,
	setSearchEngineURLText,
	deleteSearchEngineMenuText
} from '../../messages/settingsMessages';
import { editMessageOptions, replyOptions } from '.';
import { deleteUserSearchEngine, getUserSearchEngines } from '../../../services/users';
import { EditSearchEngineQuestion } from '../../questions/SearchEngines';

export function buildSearchEnginesMenu() {
	return new Menu<BotContext>('search-engines-menu')
		.dynamic(async (ctx) => {
			if (!ctx.from) return;
			const userSearchEngines = await getUserSearchEngines(ctx.from.id);

			const searchEnginesRange = new MenuRange<BotContext>();
			for (let i = 0; i < userSearchEngines.length; i++) {
				const searchEngine = userSearchEngines[i];
				if (!searchEngine) continue;

				searchEnginesRange.submenu(searchEngine.name, 'edit-search-engine-menu', (ctx) => {
					ctx.session.settings.searchEngines.editing = {
						name: searchEngine.name,
						url: searchEngine.url,
						id: searchEngine.id
					};
					ctx.editMessageText(editSearchEngineMenuText(searchEngine.name, searchEngine.url), editMessageOptions);
				});

				if (i % 2) searchEnginesRange.row();
			}
			return searchEnginesRange;
		})
		.row()
		.text('➕ Adicionar Mecanismo de Busca', (ctx) => {
			ctx.session.settings.searchEngines.editing = { field: 'name' };
			ctx.reply(
				setSearchEngineNameText + EditSearchEngineQuestion.messageSuffixHTML(ctx.msgId?.toString()),
				replyOptions
			);
		})
		.row()
		.text('↩️ Restaurar padrões')
		.row()
		.back('⬅️ Voltar', (ctx) => ctx.editMessageText(mainMenuText, editMessageOptions));
}

export function buildEditSearchEnginesMenu() {
	return new Menu<BotContext>('edit-search-engine-menu')
		.text('Editar nome', (ctx) => {
			ctx.session.settings.searchEngines.editing.field = 'name';
			ctx.reply(
				setSearchEngineNameText + EditSearchEngineQuestion.messageSuffixHTML(ctx.msgId?.toString()),
				replyOptions
			);
		})
		.text('Editar URL', (ctx) => {
			ctx.session.settings.searchEngines.editing.field = 'url';
			ctx.reply(
				setSearchEngineURLText + EditSearchEngineQuestion.messageSuffixHTML(ctx.msgId?.toString()),
				replyOptions
			);
		})
		.row()
		.submenu('Apagar permanentemente', 'delete-search-engine-menu', (ctx) => {
			const name = ctx.session.settings.searchEngines.editing.name;
			if (!name) return;

			ctx.editMessageText(deleteSearchEngineMenuText(name), editMessageOptions);
		})
		.row()
		.back('⬅️ Voltar', (ctx) => {
			ctx.session.settings.searchEngines.editing = {};
			ctx.editMessageText(searchEnginesMenuText, editMessageOptions);
		});
}

export function buildDeleteSearchEngineMenu() {
	return new Menu<BotContext>('delete-search-engine-menu')
		.submenu('Apagar permanentemente', 'search-engines-menu', async (ctx) => {
			const name = ctx.session.settings.searchEngines.editing.name;
			if (!name) return;

			await deleteUserSearchEngine(ctx.from.id, name);
			ctx.editMessageText(searchEnginesMenuText, editMessageOptions);
		})
		.back('Cancelar', async (ctx) => {
			const searchEngine = ctx.session.settings.searchEngines.editing;
			ctx.editMessageText(
				editSearchEngineMenuText(searchEngine.name || 'desconhecido', searchEngine.url || 'desconhecido'),
				editMessageOptions
			);
		});
}
