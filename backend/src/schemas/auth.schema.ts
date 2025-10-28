// Cesta: backend/src/schemas/auth.schema.ts

import { z } from 'zod';

/**
 * Schéma pro přihlášení
 */
export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'E-mail je povinný.')
		.email('E-mail musí být ve správném formátu.')
		.toLowerCase(),
	password: z.string().trim().min(8, 'Heslo musí mít alespoň 8 znaků.'),
});

/**
 * TypeScript typy odvozené ze schémat
 */
export type LoginInput = z.infer<typeof loginSchema>;
