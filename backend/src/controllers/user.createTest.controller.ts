// Cesta: backend/src/controllers/user.createTest.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../libs/prisma.js';
import { hashPassword } from '../utils/hash.js';

export const createTestUser = async (req: Request, res: Response) => {
	try {
		const existing = await prisma.user.findUnique({
			where: { email: 'patrik@sommer.media' },
		});

		if (existing) {
			return res.status(400).json({
				success: false,
				error: {
					code: 'USER_EXISTS',
					message: 'Testovací uživatel už existuje.',
				},
			});
		}

		const hashed = await hashPassword('patrik11');

		const user = await prisma.user.create({
			data: {
				firstName: 'Patrik',
				lastName: 'Sommer',
				email: 'patrik@sommer.media',
				password: hashed,
				role: 'ADMIN',
			},
		});

		return res.status(201).json({
			success: true,
			data: {
				user: {
					id: user.id,
					email: user.email,
					role: user.role,
				},
			},
			message: 'Testovací uživatel vytvořen.',
		});
	} catch (error) {
		console.error('[CREATE_TEST_USER_ERROR]', error);
		return res.status(500).json({
			success: false,
			error: {
				code: 'SERVER_ERROR',
				message: 'Nepodařilo se vytvořit testovacího uživatele.',
			},
		});
	}
};
