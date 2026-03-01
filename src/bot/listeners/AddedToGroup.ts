import type { FilterQuery } from 'grammy';
import type { BotContext } from '../bot';
import { Listener } from '../../models/Listener';
import { StartCommand } from '../commands/Start';

export class AddedToGroupListener extends Listener {
	listenerName = 'added-to-group';
	on: FilterQuery[] = [':group_chat_created', ':supergroup_chat_created', ':new_chat_members:me'];
	saveUserData = false;

	handle = (ctx: BotContext) => {
		const startCommand = new StartCommand();
		startCommand.handle(ctx);
	};
}
