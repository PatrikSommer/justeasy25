// Cesta: backend/src/config/env.ts

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// definujeme schéma, které popisuje povinné proměnné
const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: z.coerce.number().default(4000),

	JWT_SECRET: z.string().min(10),
	JWT_EXPIRES_IN: z.string().default('1d'),
	JWT_REFRESH_SECRET: z.string().min(10),
	JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

// validace proměnných prostředí
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	const tree = z.treeifyError(parsed.error);
	console.error('❌ Invalid environment variables:\n', tree);
	process.exit(1);
}

// export validovaných proměnných
export const env = parsed.data;
