import { Bot, Context, session, type SessionFlavor } from 'grammy';
import { registerCommands, registerMenus } from './commands';
import { registerListeners } from './listeners';
import { autoQuote } from '@roziscoding/grammy-autoquote';
import { registerStatelessQuestions } from './questions';
import type { SessionData } from '../models/SessionData';
const TG_TOKEN = process.env.TG_TOKEN;

if (!TG_TOKEN) throw new Error('Missing TG_TOKEN in environment variables.');

const initialSessionData = {
	settings: {
		searchEngines: {
			editing: {}
		}
	}
};

export type BotContext = Context & SessionFlavor<SessionData>;
export const bot = new Bot<BotContext>(TG_TOKEN);
bot.use(autoQuote());
bot.use(session({ initial: () => initialSessionData }));
registerMenus(bot);
registerStatelessQuestions(bot);
registerCommands(bot);
registerListeners(bot);
