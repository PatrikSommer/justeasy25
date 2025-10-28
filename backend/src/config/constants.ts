// Cesta: backend/src/config/constants.ts

/**
 * Časové konstanty pro JWT tokeny
 */

// Access token - krátká platnost (uložený v paměti frontendu)
export const ACCESS_TOKEN_EXPIRES_IN = '1d'; // 1 den

// Refresh token - dlouhá platnost (uložený v httpOnly cookie)
export const REFRESH_TOKEN_EXPIRES_IN = '15d'; // 15 dní

// Refresh token expirace v milisekundách (pro databázi)
export const REFRESH_TOKEN_EXPIRES_MS = 15 * 24 * 60 * 60 * 1000; // 15 dní

/**
 * Bcrypt - počet salt rounds pro hashování hesla
 */
export const BCRYPT_SALT_ROUNDS = 10;

/**
 * Cookie konfigurace
 */
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
export const REFRESH_TOKEN_COOKIE_MAX_AGE = REFRESH_TOKEN_EXPIRES_MS; // 15 dní
