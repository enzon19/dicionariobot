import { saveUserSearchEngine } from '../../services/users';
import type { BotContext } from '../bot';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import { editMessageOptions, replyOptions } from '../menus/settings';
import { editSearchEngineMenuText, setSearchEngineURLText } from '../messages/settingsMessages';
import { buildEditSearchEnginesMenu } from '../menus/settings/searchEnginesMenus';
import { CancelCommand } from '../commands/Cancel';

const cancelCommand = new CancelCommand();

export const EditSearchEngineQuestion = new StatelessQuestion<BotContext>(
	'search-engine-edit',
	async (ctx, msgID?: string) => {
		const text = ctx.message.text;
		if (cancelCommand.commands.includes(text?.replace('/', '') || '')) return cancelCommand.handle(ctx);

		let searchEngine = ctx.session.settings.searchEngines.editing;
		if (!searchEngine.field) return;

		ctx.session.settings.searchEngines.editing[searchEngine.field] = text;
		searchEngine = ctx.session.settings.searchEngines.editing;

		const { name, url, id } = searchEngine;
		try {
			if (!ctx.from) return;

			if (name && url) {
				const updatedSearchEngine = await saveUserSearchEngine(ctx.from.id, { name, url, id });
				await ctx.react(['👍']);

				if (msgID && ctx.chatId && updatedSearchEngine) {
					ctx.api.editMessageText(
						ctx.chatId,
						Number(msgID),
						editSearchEngineMenuText(updatedSearchEngine.name, updatedSearchEngine.url),
						{ ...editMessageOptions, reply_markup: buildEditSearchEnginesMenu() }
					);
				}
			} else {
				if (searchEngine.field == 'name') {
					ctx.session.settings.searchEngines.editing.field = 'url';
					ctx.reply(setSearchEngineURLText + EditSearchEngineQuestion.messageSuffixHTML(msgID), replyOptions);
				} else if (searchEngine.field == 'url') {
					ctx.session.settings.searchEngines.editing.field = 'name';
					ctx.reply(setSearchEngineURLText + EditSearchEngineQuestion.messageSuffixHTML(msgID), replyOptions);
				}
			}
		} catch (e) {
			if (e == 'Missing $.') {
				ctx.reply(
					'Você esqueceu de <b>adicionar o "$". Tente novamente, respondendo esta mensagem.</b>' +
						EditSearchEngineQuestion.messageSuffixHTML(msgID),
					replyOptions
				);
			} else if (e == 'Invalid URL.') {
				ctx.reply(
					'Isto <b>não</b> é um URL válido. <b>Tente novamente, respondendo esta mensagem.</b>' +
						EditSearchEngineQuestion.messageSuffixHTML(msgID),
					replyOptions
				);
			} else {
				console.error(e);
			}
		}
	}
);
