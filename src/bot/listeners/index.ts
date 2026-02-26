import type { Bot, Context } from 'grammy';
import type { Listener } from '../../models/Listener';

const listeners: Listener[] = [];

export function registerListeners(bot: Bot<Context>): void {
	for (const listener of listeners) {
		listener.register(bot);
	}
}
