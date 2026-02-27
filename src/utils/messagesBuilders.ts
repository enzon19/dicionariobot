export function getWordFromSyllables(syllables: string[], fallbackWord: string) {
	fallbackWord = fallbackWord;
	if (fallbackWord.includes('-')) return fallbackWord;
	return syllables.join('') || fallbackWord;
}

export function buildHeader(resource: string, word: string) {
	return `<u><b>${resource.toUpperCase()} DE ${word.toUpperCase()}</b></u>`;
}

export function buildWaitingReplyMessage(resource: string) {
	return `Respondendo <b>esta mensagem</b>, envie a palavra que você quer ${resource}.`;
}

export async function buildEmptyMessage(
	resource: string,
	gender: 'masculine' | 'feminine',
	word: string
) {
	const suffix = gender == 'feminine' ? 'cadastradas' : 'cadastrados';
	return `Infelizmente, a palavra <b>"${word}"</b> não possui ${resource} ${suffix} no dicionário.`; // \n\nPesquisar em: ${await getUserSearchEngines(null, args, chatID)}"`
}

export async function buildGenericResourceMessage(
	word: string,
	resource: string,
	gender: 'masculine' | 'feminine',
	resourceData: any[],
	blocks: string[],
	syllables?: string[]
) {
	const correctWordSpelling = syllables ? getWordFromSyllables(syllables, word) : word;

	if (resourceData.length == 0)
		return [await buildEmptyMessage(resource, gender, correctWordSpelling)];

	const header = buildHeader(resource, correctWordSpelling);
	return [header, ...blocks].filter((e) => e);
}
