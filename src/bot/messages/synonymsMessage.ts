import { getSyllables, getSynonyms } from '../../services/dictionary';
import { buildGenericResourceMessage } from '../../utils/messagesBuilders';
import normalizeWord from '../../utils/normalizeWord';

export default async function getSynonymsMessage(word: string, returnAsArray: boolean = false) {
	word = normalizeWord(word);
	const resource = 'sinônimos';
	const syllables = await getSyllables(word);
	const synonyms = await getSynonyms(word);
	const synonymsBlock = synonyms.join(', ');

	const message = await buildGenericResourceMessage(
		word,
		resource,
		'masculine',
		synonyms,
		[synonymsBlock],
		syllables
	);

	return returnAsArray ? message : message.join('\n\n');
}
