import { getSynonyms, getSyllables } from '../../services/dictionary';
import { buildEmptyMessage, buildHeader, getWordFromSyllables } from '../../utils/messagesBuilders';
import normalizeWord from '../../utils/normalizeWord';

export default async function getSynonymsMessage(word: string) {
	const resource = 'sinônimos';
	word = normalizeWord(word);
	const syllables = await getSyllables(word);
	const synonyms = await getSynonyms(word);
	const correctWordSpelling = getWordFromSyllables(syllables, word);

	if (synonyms.length == 0)
		return await buildEmptyMessage(resource, 'masculine', correctWordSpelling);

	const header = buildHeader(resource, correctWordSpelling);
	const synonymsBlock = synonyms.join(', ');

	return [header, synonymsBlock].filter((e) => e).join('\n\n');
}
