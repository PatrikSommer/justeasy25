// Cesta: backend/src/utils/hash.ts

import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../config/constants.js';

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
	return bcrypt.hash(password, salt);
};

export const comparePassword = (plain: string, hashed: string) => {
	return bcrypt.compare(plain, hashed);
};
