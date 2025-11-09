// Cesta: backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Začínám seedování databáze...');

	// ===================================
	// CAR CATEGORIES
	// ===================================
	const categories = [
		{ id: 1, name: 'osobní' },
		{ id: 2, name: 'minivany' },
		{ id: 3, name: 'dodávky' },
		{ id: 4, name: 'pickupy' },
		{ id: 5, name: 'nákladní' },
		{ id: 6, name: 'čtyřkolky' },
		{ id: 7, name: 'karavany' },
		{ id: 8, name: 'přívěsy' },
		{ id: 9, name: 'obytné vozy' },
	];

	console.log('📦 Vytvářím kategorie aut...');

	for (const category of categories) {
		await prisma.carCategory.upsert({
			where: { id: category.id },
			update: {},
			create: category,
		});
	}

	console.log(`✅ Vytvořeno ${categories.length} kategorií`);

	console.log('🎉 Seedování dokončeno!');
}

main()
	.catch((e) => {
		console.error('❌ Chyba při seedování:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
