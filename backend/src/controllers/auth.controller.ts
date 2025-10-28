// Cesta: backend/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../libs/prisma.js';
import { comparePassword } from '../utils/hash.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';
import {
	REFRESH_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_MAX_AGE,
	REFRESH_TOKEN_EXPIRES_MS,
} from '../config/constants.js';
import { env } from '../config/env.js';
import { LoginInput } from '../schemas/auth.schema.js';

export const login = async (req: Request, res: Response) => {
	try {
		// Data jsou už validovaná pomocí validate middleware
		const { email, password } = req.body as LoginInput;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: {
					code: 'MISSING_CREDENTIALS',
					message: 'Je nutné zadat e-mail i heslo.',
				},
			});
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !user.isActive) {
			return res.status(401).json({
				success: false,
				error: {
					code: 'INVALID_CREDENTIALS',
					message: 'E-mail nebo heslo není správné.',
				},
			});
		}

		const validPassword = await comparePassword(password, user.password);
		if (!validPassword) {
			return res.status(401).json({
				success: false,
				error: {
					code: 'INVALID_CREDENTIALS',
					message: 'E-mail nebo heslo není správné.',
				},
			});
		}

		const accessToken = createAccessToken(user.id);
		const refreshToken = createRefreshToken(user.id);

		await prisma.userToken.create({
			data: {
				userId: user.id,
				token: refreshToken,
				tokenExpires: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS), // 15 dní
			},
		});

		res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
		});

		return res.status(200).json({
			success: true,
			data: {
				accessToken,
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
				},
			},
			message: 'Přihlášení proběhlo úspěšně.',
		});
	} catch (error) {
		console.error('[AUTH_LOGIN_ERROR]', error);
		return res.status(500).json({
			success: false,
			error: {
				code: 'SERVER_ERROR',
				message: 'Došlo k neočekávané chybě na serveru.',
			},
		});
	}
};
