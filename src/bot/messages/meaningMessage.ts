import type { Meaning } from '../../models/Meaning';
import { getMeanings, getSyllables } from '../../services/dictionary';
import { buildEmptyMessage, buildHeader, getWordFromSyllables } from '../../utils/messagesBuilders';
import normalizeWord from '../../utils/normalizeWord';

function buildSyllablesBlock(syllables: string[]) {
	if (!syllables.length) return '';
	return `<b>Sílabas:</b> ${syllables.join('-')} (${syllables.length})`;
}

function buildMeaningBlock({ partOfSpeech, meanings, etymology }: Meaning) {
	let block = '';
	if (partOfSpeech) block += `<b>Classe:</b> ${partOfSpeech}\n`;
	if (meanings.length) block += `<b>Definições:</b>\n${meanings.map((m) => '• ' + m).join('\n')}\n`;
	if (etymology) block += `<b>Etimologia:</b> ${etymology}\n`;
	return block.trim();
}

export default async function getMeaningMessage(word: string) {
	const resource = 'definições';
	word = normalizeWord(word);
	const syllables = await getSyllables(word);
	const meanings = await getMeanings(word);
	const correctWordSpelling = getWordFromSyllables(syllables, word);

	if (meanings.length == 0)
		return await buildEmptyMessage(resource, 'feminine', correctWordSpelling);

	const header = buildHeader(resource, correctWordSpelling);
	const syllablesBlock = buildSyllablesBlock(syllables);
	const meaningsBlock = meanings.map(buildMeaningBlock);

	return [header, syllablesBlock, ...meaningsBlock].filter((e) => e).join('\n\n');
}
