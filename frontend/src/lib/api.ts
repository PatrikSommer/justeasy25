// Cesta: frontend/src/lib/api.ts
'use server';

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
 * Univerzální funkce pro volání backendu
 */
export async function apiFetch<T = unknown>(
	endpoint: string,
	options: RequestInit = {}
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
			credentials: 'include', // Pro cookies (refresh token)
		});

		const data = await response.json();

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
