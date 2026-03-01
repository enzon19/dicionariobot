import type { Bot, FilterQuery } from 'grammy';
import type { BotContext } from '../bot/bot';
import { saveUserLastUse } from '../services/users';

export abstract class Listener {
	abstract listenerName: string;
	abstract on: FilterQuery[];
	abstract saveUserData: boolean;
	abstract handle(ctx: BotContext): void;

	register(bot: Bot<BotContext>): void {
		bot.on(this.on, async (ctx) => {
			this.handle(ctx);

			if (this.saveUserData) {
				try {
					if (ctx.from) await saveUserLastUse(ctx.from.id, { type: this.listenerName });
				} catch (err) {
					console.error('Error saving user data:', err);
				}
			}
		});
	}
}
