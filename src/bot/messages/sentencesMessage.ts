import type { Sentence } from '../../models/Sentence';
import { getSentences, getSyllables } from '../../services/dictionary';
import { buildEmptyMessage, buildHeader, getWordFromSyllables } from '../../utils/messagesBuilders';
import normalizeWord from '../../utils/normalizeWord';

function buildMeaningBlock({ sentence, author }: Sentence) {
	let block = '';
	if (sentence) {
		block += `<blockquote>${sentence}\n\n<i>${author.replace('- ', '— ') || 'Autor desconhecido'}</i></blockquote>`;
	}
	return block.trim();
}

export default async function getSentencesMessage(word: string) {
	const resource = 'exemplos';
	word = normalizeWord(word);
	const syllables = await getSyllables(word);
	const sentences = await getSentences(word);
	const correctWordSpelling = getWordFromSyllables(syllables, word);

	if (sentences.length == 0)
		return await buildEmptyMessage(resource, 'masculine', correctWordSpelling);

	const header = buildHeader(resource, correctWordSpelling);
	const sentencesBlock = sentences.map(buildMeaningBlock);

	return [header, ...sentencesBlock].filter((e) => e).join('\n\n');
}
