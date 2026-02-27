import { GrammyError, HttpError } from 'grammy';
import { bot } from './bot/bot';
import { server as createWebServer } from './web/server';
const PORT = process.env.PORT;

async function main() {
	const server = await createWebServer();
	server.listen({ port: Number(PORT) || 2608 }, (err, address) => {
		if (err) console.error(err);
		console.info(`Site do Dicionário Bot funcionando em ${address}.`);
	});

	bot.start({
		onStart: () => {
			console.info('Dicionário Bot online no Telegram.');
		}
	});
	process.once('SIGINT', () => bot.stop());
	process.once('SIGTERM', () => bot.stop());

	process.once('unhandledRejection', (reason, promise) => console.error(reason, promise));
	process.once('uncaughtException', (reason, origin) => console.error(reason, origin));
	bot.catch((err) => {
		const ctx = err.ctx;
		console.error(`Error while handling update ${ctx.update.update_id}:`);
		const e = err.error;
		if (e instanceof GrammyError) {
			console.error('Error in request:', e.description);
		} else if (e instanceof HttpError) {
			console.error('Could not contact Telegram:', e);
		} else {
			console.error('Unknown error:', e);
		}
	});
}

main();
