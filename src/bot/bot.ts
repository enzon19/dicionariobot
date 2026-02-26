import { Bot } from 'grammy';
import { registerCommands } from './commands';
import { registerListeners } from './listeners';
const TG_TOKEN = process.env.TG_TOKEN;

if (!TG_TOKEN) throw new Error('TG_TOKEN não definido');

export const bot = new Bot(TG_TOKEN);
registerCommands(bot);
registerListeners(bot);
