import type { Menu } from '@grammyjs/menu';
import type { Bot, Context } from 'grammy';
const ADMIN_IDS = process.env.ADMIN_IDS;

export abstract class Command {
	abstract name: string;
	abstract commands: string[];
	abstract description: string;
	abstract admin: boolean;
	abstract saveUserData: boolean;
	abstract handle(ctx: Context): void;

	menu?: Menu;
	args?: string;
	example?: string;

	register(bot: Bot<Context>): void {
		bot.command(this.commands, (ctx) => {
			if (this.admin) {
				const admins = ADMIN_IDS?.split(',') || [];
				if (!admins.includes(ctx.message?.from.id.toString() || '')) return;
			}

			this.handle(ctx);

			if (this.saveUserData) {
				try {
					// salvar dados
				} catch (err) {
					console.error('Erro ao salvar dados do usuário:', err);
				}
			}
		});
	}
}
