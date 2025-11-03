// Cesta: frontend/src/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '@/lib/api';
import { API_VERSION } from '@/config/const';
import { AuthResponse, LoginResponse } from '@/types/auth';

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
export async function getCurrentUser(): Promise<{
	success: boolean;
	data?: AuthResponse;
	error?: { code: string; message: string };
}> {
	const cookieStore = await cookies();
	const token = cookieStore.get('accessToken')?.value;

	if (!token) {
		return {
			success: false,
			error: { code: 'NO_TOKEN', message: 'Nejste přihlášeni.' },
		};
	}

	const result = await apiFetch<AuthResponse>(`/${API_VERSION}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return result;
}
