import type { BotContext } from '../bot';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import { handleWordRequest } from '../../utils/handleWordRequest';
import getSentencesMessage from '../messages/sentencesMessage';

export const SentencesQuestion = new StatelessQuestion<BotContext>('sentences', async (ctx) => {
	handleWordRequest(ctx, getSentencesMessage, 'exemplos');
});
