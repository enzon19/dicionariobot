import type { BotContext } from '../bot/bot';
import { CancelCommand } from '../bot/commands/Cancel';

const cancelCommand = new CancelCommand();
export function hasCancelCommand(ctx: BotContext, text: string) {
	if (cancelCommand.commands.includes(text?.replace('/', '') || '')) {
		cancelCommand.handle(ctx);
		return true;
	}
	return false;
}
