// Cesta: backend/src/routes/users.routes.ts

import { Router } from 'express';
import { prisma } from '../libs/prisma.js';
import { createTestUser } from '../controllers/user.createTest.controller.js';

const router = Router();

// POST /users/create-test
router.post('/create-test', createTestUser);

// GET /users
router.get('/', async (_req, res) => {
	const users = await prisma.user.findMany();
	res.json(users);
});

export default router;
