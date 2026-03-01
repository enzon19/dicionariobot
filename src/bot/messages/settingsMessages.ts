import { getUserShortcuts } from '../../services/users';

const shortcutNameInPortuguese = {
	meanings: 'definições da palavra',
	synonyms: 'sinônimos da palavra',
	sentences: 'exemplos da palavra'
} as const;

export const mainMenuText =
	'<u><b>CONFIGURAÇÕES</b></u>\n\nConfigure os atalhos do chat privado, gerencie mecanismos de busca e saiba quais dados são armazenados pelo bot.';

export async function shortcutsMenuText(userID: number) {
	const userShortcuts = await getUserShortcuts(userID);

	return `<u><b>CONFIGURAÇÕES > ATALHOS</b></u>\n\nOs atalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função. \n\nEscolha um tipo de atalho para configurar. Saiba mais no comando /ajuda.\n\n<b>Atalho sem /:</b> ${shortcutNameInPortuguese[userShortcuts.shortcut]}\n<b>Atalho com /:</b> ${shortcutNameInPortuguese[userShortcuts.slash_shortcut]}`;
}

export const changeShortcutsMenuText = (slash: boolean) =>
	`<u><b>CONFIGURAÇÕES > ATALHOS > ${slash ? 'COM' : 'SEM'} /</b></u>\n\nAtalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função.\n\nEscolha uma função para o <b>atalho ${slash ? 'com' : 'sem'} /</b>:`;
