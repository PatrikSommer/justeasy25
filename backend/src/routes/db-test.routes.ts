// Cesta: backend/src/routes/db-test.routes.ts

import { Router } from 'express';
import { prisma } from '../libs/prisma.js';

const router = Router();

// GET /db-test
router.get('/', async (_req, res) => {
	try {
		// jednoduchý dotaz, který otestuje připojení
		await prisma.$queryRaw`SELECT 1`;
		res.json({ ok: true, message: 'Database connection successful 🚀' });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			ok: false,
			error: 'Database connection failed',
		});
	}
});

export default router;
