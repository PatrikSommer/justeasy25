// Cesta: backend/src/libs/prisma.ts

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// volitelné: aby se klient uzavíral při vypnutí procesu
process.on('beforeExit', async () => {
	await prisma.$disconnect();
});
