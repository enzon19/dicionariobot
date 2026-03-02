import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

export async function server() {
	const fastify = Fastify();

	fastify.register(fastifyStatic, {
		root: path.join(__dirname, 'public'),
		extensions: ['html']
	});

	return fastify;
}
