import type { BotContext } from '../bot';
import { StatelessQuestion } from '@grammyjs/stateless-question';
import getMeaningMessage from '../messages/meaningMessage';
import { handleWordRequest } from '../../utils/handleWordRequest';

export const MeaningsQuestion = new StatelessQuestion<BotContext>('meanings', async (ctx) => {
	handleWordRequest(ctx, getMeaningMessage, 'definir');
});
