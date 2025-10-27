// Cesta: backend/src/controllers/auth.me.controller.ts

import { Request, Response } from 'express';

export const me = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;

		return res.status(200).json({
			success: true,
			data: {
				user,
			},
		});
	} catch (error) {
		console.error('[AUTH_ME_ERROR]', error);
		return res.status(500).json({
			success: false,
			error: {
				code: 'SERVER_ERROR',
				message: 'Došlo k chybě při načítání dat uživatele.',
			},
		});
	}
};
