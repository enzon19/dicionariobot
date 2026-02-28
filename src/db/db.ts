import { drizzle } from 'drizzle-orm/node-postgres';

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_CA = process.env.DATABASE_CA;
const DATABASE_CERT = process.env.DATABASE_CERT;
const DATABASE_KEY = process.env.DATABASE_KEY;

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME)
	throw new Error('Missing database environment variables.');

export const db = drizzle({
	connection: {
		host: DATABASE_HOST,
		port: Number(DATABASE_PORT),
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		database: DATABASE_NAME,
		ssl:
			DATABASE_CA && DATABASE_CERT && DATABASE_KEY
				? {
						ca: DATABASE_CA,
						cert: DATABASE_CERT,
						key: DATABASE_KEY
					}
				: false
	}
});
