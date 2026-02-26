import type { Bot, Context } from 'grammy';
import type { Listener } from '../../models/Listener';
import { AddedToGroupListener } from './AddedToGroup';

const listeners: Listener[] = [new AddedToGroupListener()];

export function registerListeners(bot: Bot<Context>): void {
	for (const listener of listeners) {
		listener.register(bot);
	}
}
