// Cesta: frontend/src/app/(public)/login/actions/loginAction.ts
'use server';

import { z } from 'zod';

const LoginSchema = z.object({
	email: z.string().email({ message: 'Neplatný e-mail' }),
	password: z.string().min(6, { message: 'Heslo musí mít alespoň 6 znaků' }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export async function loginAction(formData: LoginInput) {
	const parsed = LoginSchema.safeParse(formData);
	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.flatten().fieldErrors,
		};
	}

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parsed.data),
				credentials: 'include',
			}
		);

		const data = await res.json();

		if (!res.ok) {
			return {
				success: false,
				error: data.error?.message || 'Neplatné přihlašovací údaje',
			};
		}

		return {
			success: true,
			data: data.data,
		};
	} catch (error) {
		console.error('[LOGIN_ACTION_ERROR]', error);
		return {
			success: false,
			error: 'Server momentálně není dostupný.',
		};
	}
}
