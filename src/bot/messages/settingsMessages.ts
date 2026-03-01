import { getUserData, getUserShortcuts } from '../../services/users';

export const mainMenuText =
	'<u><b>CONFIGURAÇÕES</b></u>\n\nConfigure os atalhos do chat privado, gerencie mecanismos de busca e saiba quais dados são armazenados pelo bot.';

// SHORTCUTS
const shortcutNameInPortuguese = {
	meanings: 'definições da palavra',
	synonyms: 'sinônimos da palavra',
	sentences: 'exemplos da palavra'
} as const;

export async function shortcutsMenuText(userID: number) {
	const userShortcuts = await getUserShortcuts(userID);

	return `<u><b>CONFIGURAÇÕES > ATALHOS</b></u>\n\nAtalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função.\n\nEscolha um tipo de atalho para configurar. Saiba mais no comando /ajuda.\n\n<b>Atalho sem /:</b> ${shortcutNameInPortuguese[userShortcuts.shortcut]}\n<b>Atalho com /:</b> ${shortcutNameInPortuguese[userShortcuts.slash_shortcut]}`;
}

export const changeShortcutsMenuText = (slash: boolean) =>
	`<u><b>CONFIGURAÇÕES > ATALHOS > ${slash ? 'COM' : 'SEM'} /</b></u>\n\nAtalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função.\n\nEscolha uma função para o <b>atalho ${slash ? 'com' : 'sem'} /:</b>`;

// DATA

export async function dataMenuText(userID: number) {
	const user = await getUserData(userID);

	const header = `<u><b>CONFIGURAÇÕES > DADOS</b></u>\n`;
	if (!user) return [header, 'Sem dados.'].join('\n');

	const userIDBlock = `<b>ID do Telegram:</b> ${user.id}`;
	const shortcutBlock = `<b>Atalho sem /:</b> ${shortcutNameInPortuguese[user.shortcut]}`;
	const slashShortcutBlock = `<b>Atalho com /:</b> ${shortcutNameInPortuguese[user.slash_shortcut]}`;
	const enginesBlock = `<b>Mecanismos de busca:</b> ${'a'}`;
	const createdAtBlock = `<b>Primeira interação com o bot:</b> ${user.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
	const lastUseAtBlock = `<b>Última interação com o bot:</b> ${user.last_use_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;

	return [header, userIDBlock, shortcutBlock, slashShortcutBlock, enginesBlock, createdAtBlock, lastUseAtBlock].join(
		'\n'
	);
}

export const deleteDataMenuText =
	'<u><b>CONFIGURAÇÕES > DADOS > APAGAR</b></u>\n\nTem certeza de que deseja <b>apagar seus dados permanentemente</b>?';
