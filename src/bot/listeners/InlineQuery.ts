import { InlineQueryResultBuilder, type Context, type FilterQuery } from 'grammy';
import { Listener } from '../../models/Listener';
import type { InlineQueryResult } from 'grammy/types';
import getMeaningMessage from '../messages/meaningMessage';
import getSynonymsMessage from '../messages/synonymsMessage';
import getSentencesMessage from '../messages/sentencesMessage';
import removeTelegramHTML from '../../utils/removeTelegramHTML';
import { buildHeader, getWordFromSyllables } from '../../utils/messagesBuilders';
import { getSyllables } from '../../services/dictionary';
import { saveLastUse } from '../../services/users';

type ResourceType = 'meanings' | 'synonyms' | 'sentences';
interface MessageResult {
	type: ResourceType;
	resourceName: string;
	message: string[];
}

function buildArticleDescription(message: string[], resourceType: ResourceType) {
	if (message.length > 1) {
		if (resourceType == 'meanings') {
			message = message.slice(2).map((e) => e.replace('<b>Definições:</b>\n', ''));
		} else {
			message = message.slice(1);
		}
	}

	const sanitizedMessage = removeTelegramHTML(message.join('\n'));

	let description = sanitizedMessage.substring(0, 99);
	if (sanitizedMessage.length > 99) description += ' [...]';

	return description;
}

async function buildInlineResults(word: string): Promise<InlineQueryResult[]> {
	const messagesResults: MessageResult[] = [
		{
			type: 'meanings',
			resourceName: 'definições',
			message: await getMeaningMessage(word, true)
		},
		{
			type: 'synonyms',
			resourceName: 'sinônimos',
			message: await getSynonymsMessage(word, true)
		},
		{
			type: 'sentences',
			resourceName: 'exemplos',
			message: await getSentencesMessage(word, true)
		}
	];

	let results: InlineQueryResult[] = [];

	const syllables = await getSyllables(word);
	const correctWordSpelling = getWordFromSyllables(syllables, word);

	for (const { type, resourceName, message } of messagesResults) {
		const title = removeTelegramHTML(buildHeader(resourceName, correctWordSpelling));

		const result = InlineQueryResultBuilder.article(type + '-' + word, title, {
			description: buildArticleDescription(message, type),
			thumbnail_url: `https://raw.githubusercontent.com/enzon19/dicionariobot/fc983d0c7a21c81da600a2102048d234219d6b80/public/inline/${type}_${correctWordSpelling[0]
				?.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')}.png`
		}).text(message.join('\n\n'), {
			parse_mode: 'HTML'
		});

		results.push(result);
	}

	return results;
}

export class InlineQueryListener extends Listener {
	listenerName = 'inline-query';
	on: FilterQuery[] = ['inline_query'];
	saveUserData = true;

	handle = async (ctx: Context) => {
		const query = ctx.inlineQuery?.query?.trim();
		if (!query)
			return await ctx.answerInlineQuery([], {
				button: {
					text: 'Escreva uma palavra para consultar',
					start_parameter: 'from-inline'
				},
				cache_time: 7 * 24 * 3600 // 7 days
			});

		const result = await buildInlineResults(query);
		try {
			await ctx.answerInlineQuery(result, { cache_time: 1800 });
			if (ctx.from) await saveLastUse(ctx.from.id, { type: 'event:' + this.on.join(',') });
		} catch (e) {
			console.error(e);
		}
	};
}
