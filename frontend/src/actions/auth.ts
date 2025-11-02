// Cesta: frontend/src/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '@/lib/api';
import { API_VERSION } from '@/config/const';

type LoginResponse = {
	accessToken: string;
	refreshToken: string;
	user: {
		id: number;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
	};
};

/**
 * Server Action pro přihlášení
 */
export async function loginAction(email: string, password: string) {
	const result = await apiFetch<LoginResponse>(`/${API_VERSION}/auth/login`, {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});

	if (result.success && result.data) {
		const cookieStore = await cookies();

		// Access token
		cookieStore.set('accessToken', result.data.accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 15, // 15 minut
		});

		// Refresh token ✅
		cookieStore.set('refreshToken', result.data.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 15, // 15 dní
		});
	}

	return result;
}

/**
 * Server Action pro odhlášení
 */
export async function logoutAction() {
	const cookieStore = await cookies();
	// Smažeme accessToken cookie
	cookieStore.delete('accessToken');
	cookieStore.delete('refreshToken');

	return { success: true };
}

/**
 * Server Action pro získání aktuálního uživatele
 */
export async function getCurrentUser() {
	const cookieStore = await cookies();
	const token = cookieStore.get('accessToken')?.value;

	if (!token) {
		return {
			success: false,
			error: { code: 'NO_TOKEN', message: 'Nejste přihlášeni.' },
		};
	}
	// 'v1';
	const result = await apiFetch(`/${API_VERSION}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return result;
}
