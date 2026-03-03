import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fastifyFormbody from '@fastify/formbody';
import { sendNews } from '../services/news';

export async function server() {
	const fastify = Fastify();

	fastify.addHook('onRequest', async (request, reply) => {
		if (request.url.startsWith('/news')) {
			const { password } = request.query as { password?: string };
			if (password !== process.env.NEWS_PASSWORD) {
				reply.code(401).send('Unauthorized');
			}
		}
	});

	fastify.register(fastifyStatic, {
		root: path.join(__dirname, 'public'),
		extensions: ['html']
	});

	fastify.setNotFoundHandler((_, reply) => reply.code(404).type('text/html').sendFile('404.html'));

	fastify.register(fastifyFormbody);
	fastify.post('/sendNews', sendNews);

	return fastify;
}
