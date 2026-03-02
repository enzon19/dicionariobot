import type { Context, FilterQuery } from 'grammy';
import { Listener } from '../../models/Listener';
import { saveUserLastUse } from '../../services/users';
import { buildShortcutMessage } from '../messages/shortcutsMessage';
import { checkForMistakesAndBuildMessage } from '../messages/mistakesMessage';

export class TextListener extends Listener {
	listenerName = 'text-message';
	on: FilterQuery[] = ['message:text', 'message:caption'];
	saveUserData = false;

	handle = async (ctx: Context) => {
		const message = ctx.message;
		const text = message?.text || message?.caption;
		if (!text) return;

		if (message.chat.type == 'private') {
			// if it's from a private chat, it's a shortcut
			const isSlashShortcut = text.startsWith('/');

			const shortcutMessage = await buildShortcutMessage(ctx, text, isSlashShortcut);
			if (shortcutMessage)
				await ctx.reply(shortcutMessage, {
					parse_mode: 'HTML'
				});

			if (ctx.from)
				await saveUserLastUse(ctx.from.id, {
					type: this.listenerName + (isSlashShortcut ? ':slash-shortcut' : ':shortcut')
				});
		} else if (!message.from.is_bot && (message.chat.type == 'group' || message.chat.type == 'supergroup')) {
			// if it's from a group and user is not a bot, check for mistakes
			const mistakes = await checkForMistakesAndBuildMessage(ctx, text);
			if (mistakes) await ctx.reply(mistakes);

			if (ctx.from)
				await saveUserLastUse(ctx.from.id, {
					type: this.listenerName + ':mistakes'
				});
		}
	};
}
