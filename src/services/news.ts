import type { FastifyReply, FastifyRequest } from 'fastify';
import { bot } from '../bot/bot';
import { getAdmins, getUsersIDs } from './users';

export async function sendNews(request: FastifyRequest, reply: FastifyReply) {
	if (!request.body) return reply.code(400).send('Missing everything.');
	const body = request.body as Partial<{
		password: string;
		type: 'draft' | 'final';
		text: string;
		photo: string;
		tgOptions: string;
	}>;
	const password = body.password;
	if (password !== process.env.NEWS_PASSWORD) return reply.code(401).send('Unauthorized');

	const sendType = body.type;
	const messageText = body.text;
	if (!sendType || !messageText) return reply.code(400).send('Missing type or text.');
	const messagePhoto = body.photo;
	const tgOptions = (body.tgOptions && JSON.parse(body.tgOptions)) || {};

	reply.send(`${sendType} started.`);
	const usersToSend = sendType == 'final' ? await getUsersIDs() : getAdmins();
	console.log(usersToSend, sendType);

	console.log(`\n---- Sending news (${sendType}) ----\n`);
	let usersToRemove = [];

	const textInHTML = mdToHTML(messageText);
	const sendMethod = messagePhoto ? sendPhoto : sendMessage;

	for (let i = 0; i < usersToSend.length; i++) {
		const currentUser = usersToSend[i];
		if (!currentUser) continue;

		try {
			await sendMethod(currentUser, textInHTML, tgOptions, messagePhoto);
			console.log(`Sent (${i + 1}/${usersToSend.length}) - ${currentUser}`);
		} catch (error) {
			console.log('Ops. - ' + i + ' - ' + currentUser + ' - ' + error);
			usersToRemove.push(currentUser);
		}
	}

	console.log('\nInactive users: ' + JSON.stringify(usersToRemove), '\n');
}

function sendPhoto(userID: number, text: string, tgOptions: Record<string, string>, photo?: string) {
	if (!photo) return;

	return bot.api.sendPhoto(userID, photo, {
		parse_mode: 'HTML',
		caption: text,
		...(tgOptions as any)
	});
}

function sendMessage(userID: number, text: string, tgOptions: Record<string, string>, photo?: string) {
	if (photo) return;

	return bot.api.sendMessage(userID, text, {
		parse_mode: 'HTML',
		...(tgOptions as any)
	});
}

function mdToHTML(text: string) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/>/g, '&gt;')
		.replace(/</g, '&lt;')
		.replace(/_([^_]+)_/g, '<em>$1</em>')
		.replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="tg-link" href="$2">$1</a>');
}
