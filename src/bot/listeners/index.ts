import type { Bot, Context } from 'grammy';
import type { Listener } from '../../models/Listener';
import { AddedToGroupListener } from './AddedToGroup';
import { TextListener } from './Text';

const listeners: Listener[] = [new AddedToGroupListener(), new TextListener()];

export function registerListeners(bot: Bot<Context>): void {
	for (const listener of listeners) {
		listener.register(bot);
	}
}
