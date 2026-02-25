import type { Context } from 'grammy';
import { Command } from '../../models/Command';

export class AboutCommand extends Command {
	name = 'Sobre';
	commands = ['about', 'sobre'];
	description =
		'Saiba mais sobre o bot. Descubra a versão atual, notas de atualização e informações sobre o desenvolvedor.';
	saveUserData = false;

	handle(ctx: Context): void {
		const message = ctx.message;

		ctx.reply(
			`<b>Versão:</b> 4.0.0 | <a href="https://dicionariobot.enzon19.com/novidades">Notas de atualização</a> | <a href="https://github.com/enzon19/dicionariobot">GitHub</a>\n<b>Desenvolvedor:</b> @enzon19 | <a href="https://enzon19.com">Site</a> | <a href="https://github.com/enzon19">GitHub</a>`,
			{
				parse_mode: 'HTML',
				link_preview_options: {
					is_disabled: true
				},
				reply_parameters: message && {
					message_id: message?.message_id
				}
			}
		);
	}
}
