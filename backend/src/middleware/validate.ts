// Cesta: backend/src/middleware/validate.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware pro validaci request body pomocí Zod schématu
 *
 * Použití:
 * router.post('/login', validate(loginSchema), loginController);
 */
export const validate = (schema: ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			// Validujeme a transformujeme data
			const validated = schema.parse(req.body);

			// Přepíšeme req.body validovanými daty
			req.body = validated;

			next();
		} catch (err) {
			if (err instanceof ZodError) {
				// Použijeme issues místo errors (Zod má obojí)
				const issues = err.issues || [];

				// Zod chyby převedeme na přehledný formát
				return res.status(400).json({
					success: false,
					error: {
						code: 'VALIDATION_ERROR',
						message: 'Neplatná data.',
						details: issues.map((issue) => ({
							field: issue.path.join('.'),
							message: issue.message,
						})),
					},
				});
			}

			// Jiná neočekávaná chyba
			console.error('[VALIDATION_ERROR]', err);
			return res.status(500).json({
				success: false,
				error: {
					code: 'SERVER_ERROR',
					message: 'Došlo k chybě při validaci dat.',
				},
			});
		}
	};
};
