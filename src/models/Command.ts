import type { Menu } from '@grammyjs/menu';
import type { Bot, Context } from 'grammy';
import { saveUserLastUse } from '../services/users';
const ADMIN_IDS = process.env.ADMIN_IDS;

export abstract class Command {
	abstract name: string;
	abstract commands: string[];
	abstract description: string;
	abstract saveUserData: boolean;
	abstract handle(ctx: Context): void;

	admin?: boolean;
	menus?: ((...args: any[]) => Menu[] | Menu) | Menu | Menu[];
	args?: string;
	example?: string;

	register(bot: Bot<Context>): void {
		bot.command(this.commands, async (ctx) => {
			if (this.admin) {
				const admins = ADMIN_IDS?.split(',') || [];
				if (!admins.includes(ctx.from?.id.toString() || '')) return;
			}

			this.handle(ctx);

			if (this.saveUserData) {
				try {
					if (ctx.from) await saveUserLastUse(ctx.from.id, { type: 'command:' + this.commands[0] });
				} catch (err) {
					console.error('Error saving user data:', err);
				}
			}
		});
	}
}
