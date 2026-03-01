import { saveUserSearchEngine } from '../../services/users';
import type { BotContext } from '../bot';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import { editMessageOptions } from '../menus/settings';
import { editSearchEngineMenuText } from '../messages/settingsMessages';
import { buildEditSearchEnginesMenu } from '../menus/settings/searchEnginesMenus';

export const EditSearchEngineQuestion = new StatelessQuestion<BotContext>(
	'search-engine-edit',
	async (ctx, ids?: string) => {
		let searchEngine = ctx.session.settings.searchEngines.editing;
		if (!searchEngine.field) return;

		ctx.session.settings.searchEngines.editing[searchEngine.field] = ctx.message.text;
		searchEngine = ctx.session.settings.searchEngines.editing;

		const { name, url, id } = searchEngine;
		try {
			if (!(ctx.from && name && url)) return;
			const updatedSearchEngine = await saveUserSearchEngine(ctx.from.id, { name, url, id });
			await ctx.react(['👍']);

			if (ids && updatedSearchEngine) {
				const [chatID, msgID] = JSON.parse(ids);
				ctx.api.editMessageText(
					Number(chatID),
					Number(msgID),
					editSearchEngineMenuText(updatedSearchEngine.name, updatedSearchEngine.url),
					{ ...editMessageOptions, reply_markup: buildEditSearchEnginesMenu() }
				);
			}
		} catch (e) {
			if (e == 'Missing $.') {
				ctx.reply('Você esqueceu de adicionar o "$". Tente novamente.');
			} else if (e == 'Invalid URL.') {
				ctx.reply('Isto não é um URL válido. Tente novamente.');
			} else {
				console.error(e);
			}
		}
	}
);
