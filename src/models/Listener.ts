import type { Bot, Context, FilterQuery } from 'grammy';
import { saveLastUse } from '../services/users';

export abstract class Listener {
	abstract listenerName: string;
	abstract on: FilterQuery[];
	abstract saveUserData: boolean;
	abstract handle(ctx: Context): void;

	register(bot: Bot<Context>): void {
		bot.on(this.on, async (ctx) => {
			this.handle(ctx);

			if (this.saveUserData) {
				try {
					if (ctx.from) await saveLastUse(ctx.from.id, { type: 'event:' + this.on.join(',') });
				} catch (err) {
					console.error('Error saving user data:', err);
				}
			}
		});
	}
}
