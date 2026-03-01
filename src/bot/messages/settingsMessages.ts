import { getUserData, getUserShortcuts } from '../../services/users';
import { buildSearchEnginesText } from '../../utils/messagesBuilders';

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

	return `<u><b>CONFIGURAÇÕES > ATALHOS</b></u>\n\nAtalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função. Saiba mais no comando /ajuda.\n\n<b>Atalho sem /:</b> ${shortcutNameInPortuguese[userShortcuts.shortcut]}\n<b>Atalho com /:</b> ${shortcutNameInPortuguese[userShortcuts.slash_shortcut]}\n\nEscolha um tipo de atalho para configurar.`;
}

export const changeShortcutsMenuText = (slash: boolean) =>
	`<u><b>CONFIGURAÇÕES > ATALHOS > ${slash ? 'COM' : 'SEM'} /</b></u>\n\nAtalhos são uma maneira conveniente para os usuários acessarem dados de uma palavra sem precisar digitar o comando para cada função.\n\nEscolha uma função para o <b>atalho ${slash ? 'com' : 'sem'} /:</b>`;

// SEARCH ENGINES
export const searchEnginesMenuText = `<u><b>CONFIGURAÇÕES > MECANISMOS DE BUSCA</b></u>\n\nMecanismo de busca é uma ferramenta que ajuda você a encontrar informações na Internet. Quando o bot não encontrar uma palavra, ele te dará links para você pesquisar diretamente em mecanismos de busca. Saiba mais no comando /ajuda.\n\nEscolha um mecanismo de busca para editar.`;

export const editSearchEngineMenuText = (name: string, url: string) =>
	`<u><b>CONFIGURAÇÕES > MECANISMOS DE BUSCA > EDITAR</b></u>\n\n<b>Nome:</b> ${name}\n<b>URL:</b> ${url}`;

export const setSearchEngineNameText = 'Respondendo <b>esta mensagem</b>, envie o <b>nome</b> do mecanismo de busca.';
export const setSearchEngineURLText =
	'Respondendo <b>esta mensagem</b>, envie o <b>URL</b> do mecanismo de busca. Não se esqueça de adicionar o "$". Saiba mais no comando /ajuda.';

// DATA

export async function dataMenuText(userID: number) {
	const user = await getUserData(userID);

	const header = `<u><b>CONFIGURAÇÕES > DADOS</b></u>\n`;
	if (!user) return [header, 'Sem dados.'].join('\n');

	const userIDBlock = `<b>ID do Telegram:</b> ${user.id}`;
	const shortcutBlock = `<b>Atalho sem /:</b> ${shortcutNameInPortuguese[user.shortcut]}`;
	const slashShortcutBlock = `<b>Atalho com /:</b> ${shortcutNameInPortuguese[user.slash_shortcut]}`;
	const searchEnginesBlock = `<b>Mecanismos de busca:</b> ${await buildSearchEnginesText(userID, '')}`;
	const createdAtBlock = `<b>Primeira interação com o bot:</b> ${user.created_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
	const lastUseAtBlock = `<b>Última interação com o bot:</b> ${user.last_use_at.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;

	return [
		header,
		userIDBlock,
		shortcutBlock,
		slashShortcutBlock,
		searchEnginesBlock,
		createdAtBlock,
		lastUseAtBlock
	].join('\n');
}

export const deleteDataMenuText =
	'<u><b>CONFIGURAÇÕES > DADOS > APAGAR</b></u>\n\nTem certeza de que deseja <b>apagar seus dados permanentemente</b>?';
