// Cesta: backend/src/types/express.d.ts

import { UserRole } from '@prisma/client';

// Rozšíření Express Request o vlastní property 'user'
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: number;
				email: string;
				isActive: boolean;
				role: UserRole;
			};
		}
	}
}
