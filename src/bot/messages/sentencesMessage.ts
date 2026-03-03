import type { Sentence } from '../../models/Sentence';
import { getSentences, getSyllables } from '../../services/dictionary';
import { buildGenericResourceMessage } from '../../utils/messagesBuilders';
import normalizeWord from '../../utils/normalizeWord';

function buildSentencesBlock({ sentence, author }: Sentence) {
	let block = '';
	if (sentence) {
		block += `<blockquote>${sentence}\n\n<i>${author.replace('- ', '— ') || 'Autor desconhecido'}</i></blockquote>`;
	}
	return block.trim();
}

export default async function getSentencesMessage(word: string, userID: number, returnAsArray: true): Promise<string[]>;
export default async function getSentencesMessage(word: string, userID: number, returnAsArray?: false): Promise<string>;
export default async function getSentencesMessage(word: string, userID: number, returnAsArray: boolean = false) {
	word = normalizeWord(word);
	const resource = 'exemplos';
	const syllables = await getSyllables(word);
	const sentences = await getSentences(word);
	const sentencesBlock = sentences.map(buildSentencesBlock);

	const message = await buildGenericResourceMessage(
		word,
		resource,
		'masculine',
		sentences,
		userID,
		sentencesBlock,
		syllables
	);

	return returnAsArray ? message : message.join('\n\n');
}
