// Cesta: frontend/src/lib/api.ts
'use server';

import { API_VERSION } from '@/config/const';
import { cookies } from 'next/headers';

/**
 * Server-side API wrapper
 * Všechna volání na backend procházejí přes tento wrapper
 * API_SECRET_KEY nikdy neopustí server
 */

type ApiResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: unknown;
	};
	message?: string;
};

/**
 * Obnovení access tokenu pomocí refresh tokenu
 */
async function refreshAccessToken(): Promise<string | null> {
	const API_KEY = process.env.API_SECRET_KEY;
	const API_URL = process.env.BACKEND_URL || 'http://localhost:4000';
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get('refreshToken')?.value;

	if (!refreshToken) {
		return null;
	}

	try {
		const response = await fetch(`${API_URL}/${API_VERSION}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY!,
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		if (data.success && data.data?.accessToken) {
			const newAccessToken = data.data.accessToken;
			const newRefreshToken = data.data.refreshToken;

			// Uložíme nový access token
			cookieStore.set('accessToken', newAccessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 15, // 15 minut
			});

			// Uložíme nový refresh token
			cookieStore.set('refreshToken', newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 15, // 15 dní
			});

			return newAccessToken;
		}

		return null;
	} catch (error) {
		console.error('[REFRESH_TOKEN_ERROR]', error);
		return null;
	}
}

/**
 * Univerzální funkce pro volání backendu
 */
export async function apiFetch<T = unknown>(
	endpoint: string,
	options: RequestInit = {},
	isRetry = false // Prevence nekonečné smyčky
): Promise<ApiResponse<T>> {
	const API_KEY = process.env.API_SECRET_KEY;
	const API_URL = process.env.BACKEND_URL || 'http://localhost:4000';

	if (!API_KEY) {
		throw new Error('API_SECRET_KEY není nastavený v .env.local');
	}

	try {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY,
				...options.headers,
			},
			credentials: 'include',
		});

		const data = await response.json();

		// Pokud 401 a ještě jsme nezkoušeli refresh
		if (response.status === 401 && !isRetry) {
			console.log('[API] Access token vypršel, zkouším refresh...');

			// Zkusíme obnovit token
			const newAccessToken = await refreshAccessToken();

			if (newAccessToken) {
				console.log('[API] Token obnoven, opakuji request...');

				// Zopakujeme původní request s novým tokenem
				return apiFetch<T>(
					endpoint,
					{
						...options,
						headers: {
							...options.headers,
							Authorization: `Bearer ${newAccessToken}`,
						},
					},
					true // isRetry = true (prevence opakování)
				);
			} else {
				console.log(
					'[API] Refresh selhal, uživatel musí se znovu přihlásit'
				);
				// Refresh selhal → smazeme cookies
				const cookieStore = await cookies();
				cookieStore.delete('accessToken');
				cookieStore.delete('refreshToken');
			}
		}

		if (!response.ok) {
			return {
				success: false,
				error: data.error || {
					code: 'UNKNOWN_ERROR',
					message: 'Něco se pokazilo.',
				},
			};
		}

		return data;
	} catch (error) {
		console.error('[API_FETCH_ERROR]', error);
		return {
			success: false,
			error: {
				code: 'NETWORK_ERROR',
				message: 'Nepodařilo se připojit k serveru.',
			},
		};
	}
}
