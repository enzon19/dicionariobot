import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

export async function server() {
	const fastify = Fastify();

	fastify.register(fastifyStatic, {
		root: path.join(__dirname, 'public'),
		extensions: ['html']
	});

	fastify.setNotFoundHandler((request, reply) => reply.code(404).type('text/html').sendFile('404.html'));

	return fastify;
}
