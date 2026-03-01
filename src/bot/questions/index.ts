import type { Bot } from 'grammy';
import type { BotContext } from '../bot';
import type { StatelessQuestion } from '@grammyjs/stateless-question';
import { MeaningsQuestion } from './Meanings';
import { SynonymsQuestion } from './Synonyms';
import { SentencesQuestion } from './Sentences';
import { EditSearchEngineQuestion } from './SearchEngines';

const questions: StatelessQuestion<BotContext>[] = [
	MeaningsQuestion,
	SynonymsQuestion,
	SentencesQuestion,
	EditSearchEngineQuestion
];

export function registerStatelessQuestions(bot: Bot<BotContext>): void {
	for (const question of questions) {
		bot.use(question.middleware());
	}
}
