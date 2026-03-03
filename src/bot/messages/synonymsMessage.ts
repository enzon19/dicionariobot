import { getSyllables, getSynonyms } from '../../services/dictionary';
import { buildGenericResourceMessage } from '../../utils/messagesBuilders';
import normalizeWord from '../../utils/normalizeWord';

export default async function getSynonymsMessage(word: string, userID: number, returnAsArray: true): Promise<string[]>;
export default async function getSynonymsMessage(word: string, userID: number, returnAsArray?: false): Promise<string>;
export default async function getSynonymsMessage(word: string, userID: number, returnAsArray: boolean = false) {
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
		userID,
		[synonymsBlock],
		syllables
	);

	return returnAsArray ? message : message.join('\n\n');
}
