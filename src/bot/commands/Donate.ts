import type { Context } from 'grammy';
import { Command } from '../../models/Command';

export class DonateCommand extends Command {
	name = 'Doação';
	commands = ['donate', 'doar', 'apoiar'];
	description = 'Se você gosta do bot e gostaria de apoiar o desenvolvimento dele, ajude realizando uma doação!';
	saveUserData = true;

	handle(ctx: Context): void {
		ctx.reply(
			`Se você gosta do bot e apoia o desenvolvimento dele, me ajude realizando uma doação!\n\n<b>PIX:</b> enzonbarata@outlook.com\n<a href="https://enzon19.com/donate">Outros métodos...</a>`,
			{
				parse_mode: 'HTML',
				link_preview_options: {
					is_disabled: true
				}
			}
		);
	}
}
