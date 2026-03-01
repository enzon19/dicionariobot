import type { ParseMode } from 'grammy/types';
import type { Command } from '../../models/Command';
import { Menu } from '@grammyjs/menu';
import help from '../../assets/help';
import { commandsMenuText, faqMenuText, mainMenuText } from '../messages/helpMessages';

const editMessageOptions = { parse_mode: 'HTML' as ParseMode };

export function buildHelpMainMenu(commands: Command[]) {
	return new Menu('help-main-menu')
		.submenu('Comandos', 'commands-menu', (ctx) =>
			ctx.editMessageText(commandsMenuText(commands.length), editMessageOptions)
		)
		.submenu('Perguntas Frequentes', 'faq-menu', (ctx) => ctx.editMessageText(faqMenuText, editMessageOptions));
}

export function buildCommandsMenus(commands: Command[]) {
	const aboutCommandHeader = `<u><b>AJUDA > COMANDOS > SOBRE</b></u>\n\n`;
	const commandsMenu = new Menu('commands-menu');
	const allCommandsSubmenus: Menu[] = [];

	for (let i = 0; i < commands.length; i++) {
		const command = commands[i];
		if (!command) continue;

		const commandOpenMenuID = 'commands-submenu-' + command.commands[0];

		commandsMenu.submenu(command.name, commandOpenMenuID, (ctx) => {
			let aboutCommandTextBuilder = [
				`<b>Nome:</b> ${command.name}`,
				`<b>Descrição:</b> ${command.description}`,
				`<b>Comando:</b> /${command.commands[0] + ((command.args && ' ' + command.args) || '')}`
			];

			const alternativeCommands = command.commands.slice(1);
			if (alternativeCommands.length > 0)
				aboutCommandTextBuilder.push(`<b>Alternativas:</b> ${alternativeCommands.map((e) => '/' + e).join(', ')}`);
			if (command.example) aboutCommandTextBuilder.push(`<b>Exemplo:</b> <code>${command.example}</code>`);

			ctx.editMessageText(aboutCommandHeader + aboutCommandTextBuilder.join('\n'), editMessageOptions);
		});
		const commandSubmenu = new Menu(commandOpenMenuID).submenu('⬅️ Voltar', 'commands-menu', (ctx) =>
			ctx.editMessageText(commandsMenuText(commands.length), editMessageOptions)
		);
		allCommandsSubmenus.push(commandSubmenu);

		if (i % 2) commandsMenu.row();
	}

	commandsMenu
		.row()
		.submenu('⬅️ Voltar', 'help-main-menu', (ctx) => ctx.editMessageText(mainMenuText, editMessageOptions));

	return { commandsMenu, allCommandsSubmenus };
}

export function buildFaqMenus() {
	const faqSubmenuText = (section: string) =>
		`<u><b>AJUDA > PERGUNTAS FREQUENTES > ${section.toUpperCase()}</b></u>\n\nEstas são as perguntas desta categoria. <b>Clique</b> em uma delas para ver a resposta.`;
	const faqQuestionOpenHeader = (section: string) =>
		`<u><b>AJUDA > PERGUNTAS FREQUENTES > ${section.toUpperCase()} > PERGUNTA</b></u>\n\n`;

	const faqMenu = new Menu('faq-menu');
	const allFaqSubmenus: Menu[] = [];

	for (const { section, sectionID, questions } of help) {
		const faqSubmenuID = 'faq-submenu-' + sectionID;

		faqMenu
			.submenu(section, faqSubmenuID, (ctx) => ctx.editMessageText(faqSubmenuText(section), editMessageOptions))
			.row();

		const faqSubmenu = new Menu(faqSubmenuID);

		for (const question of questions) {
			const questionOpenMenuID = 'faq-question-' + sectionID + '-' + question.id;

			const faqQuestionOpenMenu = new Menu(questionOpenMenuID).submenu('⬅️ Voltar', faqSubmenuID, (ctx) =>
				ctx.editMessageText(faqSubmenuText(section), editMessageOptions)
			);

			faqSubmenu
				.submenu(question.question, questionOpenMenuID, (ctx) =>
					ctx.editMessageText(faqQuestionOpenHeader(section) + `<b>${question.question}</b>\n${question.answer}`, {
						...editMessageOptions,
						link_preview_options: {
							is_disabled: true
						}
					})
				)
				.row();

			allFaqSubmenus.push(faqQuestionOpenMenu);
		}

		faqSubmenu.submenu('⬅️ Voltar', 'faq-menu', (ctx) => ctx.editMessageText(faqMenuText, editMessageOptions));

		allFaqSubmenus.push(faqSubmenu);
	}

	faqMenu.submenu('⬅️ Voltar', 'help-main-menu', (ctx) => ctx.editMessageText(mainMenuText, editMessageOptions));

	return { faqMenu, allFaqSubmenus };
}
