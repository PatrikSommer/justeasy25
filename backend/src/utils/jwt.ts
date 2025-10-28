// Cesta: backend/src/utils/jwt.ts

import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export const createAccessToken = (userId: number): string => {
	return jwt.sign(
		{ userId },
		env.JWT_SECRET as Secret,
		{ expiresIn: env.JWT_EXPIRES_IN } as SignOptions
	);
};

export const createRefreshToken = (userId: number): string => {
	return jwt.sign(
		{ userId },
		env.JWT_REFRESH_SECRET as Secret,
		{ expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions
	);
};
