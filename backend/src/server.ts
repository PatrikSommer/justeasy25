// Cesta: backend/src/server.ts

import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './libs/prisma.js';

const { PORT, NODE_ENV } = env;

async function startServer() {
	try {
		await prisma.$connect();
		console.log('✅ Database connected');

		app.listen(PORT, () => {
			console.log(
				`✅ Server running on http://localhost:${PORT} [${NODE_ENV}]`
			);
		});
	} catch (error) {
		console.error('❌ Failed to connect to database:', error);
		process.exit(1);
	}
}

// Odpojení od databáze při ukončení
process.on('SIGINT', async () => {
	console.log('🛑 SIGINT – odpojuji databázi...');
	await prisma.$disconnect();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('🛑 SIGTERM – odpojuji databázi...');
	await prisma.$disconnect();
	process.exit(0);
});

startServer();
