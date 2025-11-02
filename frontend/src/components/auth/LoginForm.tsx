// Cesta: frontend/src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState('patrik@sommer.media');
	const [password, setPassword] = useState('patrik11');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const result = await loginAction(email, password);

			if (result.success) {
				// Přesměrujeme na dashboard
				router.push('/dashboard');
				router.refresh();
			} else {
				setError(result.error?.message || 'Přihlášení se nezdařilo.');
			}
		} catch (err) {
			setError('Došlo k neočekávané chybě.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Přihlášení</CardTitle>
				<CardDescription>
					Přihlaste se do systému Justeasy
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>E-mail</Label>
						<Input
							id='email'
							type='email'
							placeholder='vas@email.cz'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='password'>Heslo</Label>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={loading}
						/>
					</div>

					{error && (
						<div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
							{error}
						</div>
					)}

					<Button type='submit' className='w-full' disabled={loading}>
						{loading ? 'Přihlašování...' : 'Přihlásit se'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
