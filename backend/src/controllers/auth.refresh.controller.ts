// Cesta: backend/src/controllers/auth.refresh.controller.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../libs/prisma.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';
import {
	REFRESH_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_MAX_AGE,
	REFRESH_TOKEN_EXPIRES_MS,
} from '../config/constants.js';
import { env } from '../config/env.js';

export const refresh = async (req: Request, res: Response) => {
	try {
		const { token } = req.body;

		if (!token) {
			return res.status(401).json({
				success: false,
				error: {
					code: 'MISSING_TOKEN',
					message: 'Chybí refresh token.',
				},
			});
		}

		// Najdeme token v DB
		const storedToken = await prisma.userToken.findUnique({
			where: { token },
			include: { user: true },
		});

		if (!storedToken || !storedToken.user?.isActive) {
			return res.status(401).json({
				success: false,
				error: {
					code: 'INVALID_TOKEN',
					message: 'Token není platný nebo uživatel neexistuje.',
				},
			});
		}

		// Ověříme JWT
		try {
			jwt.verify(token, env.JWT_REFRESH_SECRET);
		} catch {
			await prisma.userToken.delete({ where: { token } });
			return res.status(401).json({
				success: false,
				error: {
					code: 'EXPIRED_TOKEN',
					message: 'Token vypršel, je nutné se znovu přihlásit.',
				},
			});
		}

		// Smazání starého tokenu (rotace)
		await prisma.userToken.delete({ where: { token } });

		// Vygenerování nových tokenů
		const newAccessToken = createAccessToken(storedToken.user.id);
		const newRefreshToken = createRefreshToken(storedToken.user.id);

		await prisma.userToken.create({
			data: {
				userId: storedToken.user.id,
				token: newRefreshToken,
				tokenExpires: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
			},
		});

		return res.status(200).json({
			success: true,
			data: {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			},
			message: 'Token byl obnoven.',
		});
	} catch (error) {
		console.error('[AUTH_REFRESH_ERROR]', error);
		return res.status(500).json({
			success: false,
			error: {
				code: 'SERVER_ERROR',
				message: 'Došlo k neočekávané chybě na serveru.',
			},
		});
	}
};
