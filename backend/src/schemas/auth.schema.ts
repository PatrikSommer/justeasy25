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
	password: z
		.string()
		.trim()
		.min(8, 'Heslo musí mít alespoň 8 znaků.')
		.max(72, 'Heslo může mít maximálně 72 znaků.'),
});

/**
 * Schéma pro registraci/vytvoření uživatele
 */
export const registerSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'E-mail je povinný.')
		.email('E-mail musí být ve správném formátu.')
		.toLowerCase(),
	password: z
		.string()
		.trim()
		.min(8, 'Heslo musí mít alespoň 8 znaků.')
		.max(72, 'Heslo může mít maximálně 72 znaků.'),
	firstName: z.string().trim().min(1, 'Jméno je povinné.'),
	lastName: z.string().trim().min(1, 'Příjmení je povinné.'),
});

/**
 * TypeScript typy odvozené ze schémat
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
