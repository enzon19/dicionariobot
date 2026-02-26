import type { Bot, Context, FilterQuery } from 'grammy';

export abstract class Listener {
	abstract on: FilterQuery[];
	abstract saveUserData: boolean;
	abstract handle(ctx: Context): void;

	register(bot: Bot<Context>): void {
		bot.on(this.on, (ctx) => {
			this.handle(ctx);

			if (this.saveUserData) {
				try {
					console.log('Salvar dados');
				} catch (err) {
					console.error('Erro ao salvar dados do usuário:', err);
				}
			}
		});
	}
}
