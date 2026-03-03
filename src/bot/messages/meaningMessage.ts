import type { Meaning } from '../../models/Meaning';
import { getMeanings, getSyllables } from '../../services/dictionary';
import { buildGenericResourceMessage } from '../../utils/messagesBuilders';
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

export default async function getMeaningMessage(word: string, userID: number, returnAsArray: true): Promise<string[]>;
export default async function getMeaningMessage(word: string, userID: number, returnAsArray?: false): Promise<string>;
export default async function getMeaningMessage(word: string, userID: number, returnAsArray: boolean = false) {
	word = normalizeWord(word);
	const resource = 'definições';
	const syllables = await getSyllables(word);
	const meanings = await getMeanings(word);
	const syllablesBlock = buildSyllablesBlock(syllables);
	const meaningsBlock = meanings.map(buildMeaningBlock);

	const message = await buildGenericResourceMessage(
		word,
		resource,
		'feminine',
		meanings,
		userID,
		[syllablesBlock, ...meaningsBlock],
		syllables
	);

	return returnAsArray ? message : message.join('\n\n');
}
