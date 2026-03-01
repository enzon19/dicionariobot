import type { Bot } from 'grammy';
import type { BotContext } from '../bot';
import type { Listener } from '../../models/Listener';
import { AddedToGroupListener } from './AddedToGroup';
import { TextListener } from './Text';
import { InlineQueryListener } from './InlineQuery';

const listeners: Listener[] = [new AddedToGroupListener(), new TextListener(), new InlineQueryListener()];

export function registerListeners(bot: Bot<BotContext>): void {
	for (const listener of listeners) {
		listener.register(bot);
	}
}
