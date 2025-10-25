// Cesta: backend/src/routes/users.routes.ts

import { Router } from 'express';
import { prisma } from '../libs/prisma.js';

const router = Router();

// POST /users/create-test
router.post('/create-test', async (_req, res) => {
	try {
		const newUser = await prisma.user.create({
			data: {
				firstName: 'Jan',
				lastName: 'Novák',
				email: `jan.novak+${Date.now()}@example.com`,
				password: 'test123', // jen testovací hodnota, žádné hashování zatím
				role: 'USER',
			},
		});
		res.json({ ok: true, user: newUser });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			ok: false,
			error: 'Failed to create test user',
		});
	}
});

// GET /users
router.get('/', async (_req, res) => {
	const users = await prisma.user.findMany();
	res.json(users);
});

export default router;
