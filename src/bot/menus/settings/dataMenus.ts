import { Menu } from '@grammyjs/menu';
import { dataMenuText, deleteDataMenuText, mainMenuText } from '../../messages/settingsMessages';
import { editMessageOptions } from '.';
import { deleteUser, getUserEvents } from '../../../services/users';
import { InputFile } from 'grammy';

export function buildDeleteDataMenu() {
	return new Menu('delete-data')
		.back('Apagar permanentemente', async (ctx) => {
      await deleteUser(ctx.from.id);
			ctx.editMessageText(await dataMenuText(ctx.from.id), editMessageOptions);
		})
		.back('Cancelar', async (ctx) => ctx.editMessageText(await dataMenuText(ctx.from.id), editMessageOptions));
}

export function buildDataMenu() {
	return new Menu('data-menu')
		.text('Ver eventos', async (ctx) => {
			await ctx.replyWithChatAction('upload_document');

			const events = await getUserEvents(ctx.from.id);
			const textEncoder = new TextEncoder();

			const eventsTelegramFile = new InputFile(
				textEncoder.encode(JSON.stringify(events)),
				`events-${events?.[0]?.id || 'none'}.json`
			);

			await ctx.replyWithDocument(eventsTelegramFile);
		})
		.row()
		.submenu('Apagar dados', 'delete-data', (ctx) => ctx.editMessageText(deleteDataMenuText, editMessageOptions))
		.row()
		.back('⬅️ Voltar', (ctx) => ctx.editMessageText(mainMenuText, editMessageOptions));
}
