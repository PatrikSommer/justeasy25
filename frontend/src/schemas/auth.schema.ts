// Cesta: frontend/src/schemas/auth.schema.ts

import { z } from 'zod';

/**
 * Schema pro přihlášení
 *
 * Mělo by odpovídat backend schema pro konzistenci
 */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'E-mail je povinný')
		.email('Zadejte platný e-mail')
		.toLowerCase(),

	password: z
		.string()
		.min(8, 'Heslo musí mít alespoň 8 znaků')
		.max(72, 'Heslo může mít maximálně 72 znaků'),
});

/**
 * TypeScript typ pro formulář
 */
export type LoginFormData = z.infer<typeof loginSchema>;
