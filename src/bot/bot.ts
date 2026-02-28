import { Bot } from 'grammy';
import { registerCommands } from './commands';
import { registerListeners } from './listeners';
const TG_TOKEN = process.env.TG_TOKEN;

if (!TG_TOKEN) throw new Error('Missing TG_TOKEN in environment variables.');

export const bot = new Bot(TG_TOKEN);
registerCommands(bot);
registerListeners(bot);
