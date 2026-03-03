import { type Shortcut } from '../../db/schema';
import getMeaningMessage from '../messages/meaningMessage';
import getSynonymsMessage from '../messages/synonymsMessage';
import getSentencesMessage from '../messages/sentencesMessage';
import { getUserShortcuts } from '../../services/users';

export async function chooseShortcutMessage(userID: number, slash: boolean) {
	const handlers: Record<Shortcut, (word: string, userID: number) => Promise<string>> = {
		meanings: getMeaningMessage,
		synonyms: getSynonymsMessage,
		sentences: getSentencesMessage
	};

	const userChosenShortcut = await getUserShortcuts(userID, slash ? 'slash' : 'regular');
	return handlers[userChosenShortcut];
}
