// Cesta: backend/src/utils/jwt.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const accessSecret = process.env.JWT_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export const createAccessToken = (userId: number) => {
	const options: SignOptions = {
		expiresIn:
			(process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) ||
			'15m',
	};
	return jwt.sign({ userId }, accessSecret, options);
};

export const createRefreshToken = (userId: number) => {
	const options: SignOptions = {
		expiresIn:
			(process.env
				.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn']) ||
			'15d',
	};
	return jwt.sign({ userId }, refreshSecret, options);
};
