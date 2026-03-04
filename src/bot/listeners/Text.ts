import type { FilterQuery } from 'grammy';
import type { BotContext } from '../bot';
import { Listener } from '../../models/Listener';
import { saveUserLastUse } from '../../services/users';
import { chooseShortcutMessage } from '../messages/shortcutsMessage';
import { checkForMistakesAndBuildMessage } from '../messages/mistakesMessage';
import { replyWithWordResult } from '../../utils/handleWordQueryCommand';
import { sendLastAd } from '../../services/ads';

export class TextListener extends Listener {
	listenerName = 'text-message';
	on: FilterQuery[] = ['message:text', 'message:caption'];
	saveUserData = false;

	handle = async (ctx: BotContext) => {
		const message = ctx.message;
		const text = message?.text || message?.caption;
		if (!text) return;

		if (message.chat.type == 'private' && ctx.from) {
			// if it's from a private chat, it's a shortcut
			const isSlashShortcut = text.startsWith('/');

			try {
				await sendLastAd(ctx);
			} catch (e) {
				console.error('Error sending ads:', e);
			}

			const shortcutMessageBuilder = await chooseShortcutMessage(ctx.from.id, isSlashShortcut);
			await replyWithWordResult(ctx, shortcutMessageBuilder, text);

			await saveUserLastUse(ctx.from.id, {
				type: this.listenerName + (isSlashShortcut ? ':slash-shortcut' : ':shortcut')
			});
		} else if (!message.from.is_bot && (message.chat.type == 'group' || message.chat.type == 'supergroup')) {
			// if it's from a group and user is not a bot, check for mistakes
			const mistakes = await checkForMistakesAndBuildMessage(ctx, text);

			if (mistakes) {
				await ctx.reply(mistakes);

				if (ctx.from)
					await saveUserLastUse(ctx.from.id, {
						type: this.listenerName + ':mistakes',
						metadata: `{ "group_id": ${ctx.chatId} }`
					});
			}
		}
	};
}
