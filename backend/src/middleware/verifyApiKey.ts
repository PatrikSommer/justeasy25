// Cesta: backend/src/middleware/verifyApiKey.ts

import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

/**
 * Middleware pro ověření API klíče
 * Chrání backend před přímým přístupem z browseru
 * Jen Next.js server s platným API key může volat API
 */
export const verifyApiKey = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const apiKey = req.headers['x-api-key'];

	// Výjimka pro health check (pro monitoring)
	if (req.path === '/health' || req.path === '/db-test') {
		return next();
	}

	// Kontrola API klíče
	if (!apiKey || apiKey !== env.API_SECRET_KEY) {
		return res.status(403).json({
			success: false,
			error: {
				code: 'FORBIDDEN',
				message: 'Přístup odepřen. Neplatný API klíč.',
			},
		});
	}

	next();
};
