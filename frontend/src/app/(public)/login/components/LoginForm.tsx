// Cesta: frontend/src/app/(public)/login/components/LoginForm.tsx

'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginAction } from '../actions/loginAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginSchema = z.object({
	email: z.string().email({ message: 'Neplatný e-mail' }),
	password: z.string().min(4, { message: 'Heslo musí mít alespoň 4 znaky' }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: 'patrik@sommer.media',
			password: 'patrik11',
		},
	});

	const onSubmit = (data: LoginFormData) => {
		setError(null);
		console.log(data);
		startTransition(async () => {
			const result = await loginAction(data);
			if (!result.success) {
				setError(
					typeof result.error === 'string'
						? result.error
						: 'Neplatné přihlašovací údaje.'
				);
				return;
			}
			console.log(result.data);

			// TODO: redirect do chráněné části (např. /dashboard)
			// window.location.href = '/dashboard';
		});
	};

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='mx-auto max-w-sm space-y-4 rounded-lg border p-6 shadow-sm'>
			<div>
				<Label htmlFor='email'>E-mail</Label>
				<Input
					id='email'
					type='email'
					{...form.register('email')}
					disabled={isPending}
				/>
				{form.formState.errors.email && (
					<p className='text-sm text-red-600 mt-1'>
						{form.formState.errors.email.message}
					</p>
				)}
			</div>

			<div>
				<Label htmlFor='password'>Heslo</Label>
				<Input
					id='password'
					type='password'
					{...form.register('password')}
					disabled={isPending}
				/>
				{form.formState.errors.password && (
					<p className='text-sm text-red-600 mt-1'>
						{form.formState.errors.password.message}
					</p>
				)}
			</div>

			{error && <p className='text-sm text-red-600'>{error}</p>}

			<Button type='submit' className='w-full' disabled={isPending}>
				{isPending ? 'Přihlašuji...' : 'Přihlásit se'}
			</Button>
		</form>
	);
}
