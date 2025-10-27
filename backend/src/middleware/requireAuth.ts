// Cesta: backend/src/middleware/requireAuth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../libs/prisma.js';

interface JwtPayload {
	userId: number;
}

export const requireAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				success: false,
				error: {
					code: 'MISSING_TOKEN',
					message: 'Chybí autorizační token.',
				},
			});
		}

		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as JwtPayload;

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { id: true, email: true, isActive: true, role: true },
		});

		if (!user || !user.isActive) {
			return res.status(401).json({
				success: false,
				error: {
					code: 'INVALID_USER',
					message: 'Uživatel není aktivní nebo neexistuje.',
				},
			});
		}

		// Připojíme user info k requestu
		(req as any).user = user;

		next();
	} catch (error) {
		console.error('[AUTH_MIDDLEWARE_ERROR]', error);
		return res.status(401).json({
			success: false,
			error: {
				code: 'INVALID_TOKEN',
				message: 'Přístup odepřen – token není platný.',
			},
		});
	}
};
