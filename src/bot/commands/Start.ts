import type { Context } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { Command } from '../../models/Command';
import { MeaningCommand } from './Meanings';
const BOT_USERNAME = process.env.BOT_USERNAME;

export class StartCommand extends Command {
	name = 'Introdução';
	commands = ['start'];
	description = 'Introdução do bot.';
	saveUserData = false;

	menus = new Menu('menu-cta')
		.text('Definir uma palavra', (ctx) => new MeaningCommand().handle(ctx))
		.text('Usar modo inline')
		.switchInline('');

	handle(ctx: Context): void {
		const message = ctx.message;
		const addedToGroup = message?.chat.type != 'private';

		const startText = `<b>Dicionário Bot (${BOT_USERNAME})</b>\nUm dicionário da língua portuguesa brasileira no Telegram.\n\nPara começar envie /definir, /sinonimos ou /exemplos. Você também pode usar o modo inline ao digitar @${BOT_USERNAME} no campo de mensagem em qualquer bate-papo e escrever alguma palavra. ${addedToGroup ? 'Cometa um erro gramatical e o bot pode te corrigir. Essa função só funciona <a href="https://dicionariobot.enzon19.com/lista">com essa lista de palavras</a> e se o administrador do grupo permitir o bot ter acesso às mensagens.' : 'Quando adicionado em algum grupo, pode corrigir alguns erros gramaticais.'}\n\n<i>Você pode ler a <a href="https://dicionariobot.enzon19.com/privacidade">política de privacidade</a>, além de <a href="https://github.com/enzon19/dicionariobot">ver o código-fonte do bot</a>.</i>`;

		ctx.reply(startText, {
			parse_mode: 'HTML',
			link_preview_options: {
				is_disabled: true
			},
			reply_parameters: message && {
				message_id: message?.message_id
			},
			reply_markup: this.menus
		});
	}
}
