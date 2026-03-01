import type { BotContext } from '../bot';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import { handleWordRequest } from '../../utils/handleWordRequest';
import getSynonymsMessage from '../messages/synonymsMessage';

export const SynonymsQuestion = new StatelessQuestion<BotContext>('synonyms', async (ctx) => {
	handleWordRequest(ctx, getSynonymsMessage, 'sinonimos');
});
