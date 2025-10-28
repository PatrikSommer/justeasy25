// Cesta: backend/src/middleware/requireAuth.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { env } from '../config/env.js';
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

		// Ověření JWT tokenu
		let decoded: JwtPayload;
		try {
			decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
		} catch (error) {
			// Rozlišíme mezi expired tokenem a invalid tokenem
			if (error instanceof TokenExpiredError) {
				return res.status(401).json({
					success: false,
					error: {
						code: 'TOKEN_EXPIRED',
						message: 'Token vypršel. Přihlaš se znovu.',
					},
				});
			}
			if (error instanceof JsonWebTokenError) {
				return res.status(401).json({
					success: false,
					error: {
						code: 'INVALID_TOKEN',
						message: 'Token není platný.',
					},
				});
			}
			throw error; // Jiná neočekávaná chyba
		}

		// Načteme uživatele z databáze
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

		// Připojíme user k requestu (teď type-safe díky express.d.ts)
		req.user = user;

		next();
	} catch (error) {
		console.error('[AUTH_MIDDLEWARE_ERROR]', error);
		return res.status(500).json({
			success: false,
			error: {
				code: 'SERVER_ERROR',
				message: 'Došlo k neočekávané chybě při autorizaci.',
			},
		});
	}
};
