// Cesta: backend/src/controllers/auth.refresh.controller.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../libs/prisma.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';

export const refresh = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.refreshToken;

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
			jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
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
				tokenExpires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dní
			},
		});

		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 15 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			success: true,
			data: { accessToken: newAccessToken },
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
