import type { Context, FilterQuery } from 'grammy';
import { Listener } from '../../models/Listener';
import { StartCommand } from '../commands/Start';

export class AddedToGroupListener extends Listener {
	on: FilterQuery[] = [':group_chat_created', ':supergroup_chat_created', ':new_chat_members:me'];
	saveUserData = false;

	handle = (ctx: Context) => {
		const startCommand = new StartCommand();
		startCommand.handle(ctx);
	};
}
