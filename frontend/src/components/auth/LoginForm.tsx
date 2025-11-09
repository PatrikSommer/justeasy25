// Cesta: frontend/src/components/auth/LoginForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { loginAction } from '@/actions/auth';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export function LoginForm() {
	const router = useRouter();

	// React Hook Form s Zod validací
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: process.env.NEXT_PUBLIC_DEV_EMAIL || '',
			password: process.env.NEXT_PUBLIC_DEV_PASSWORD || '',
		},
		mode: 'onSubmit', // První submit validuje
		reValidateMode: 'onBlur', // Pak validuje při blur
	});

	const onSubmit = async (data: LoginFormData) => {
		const loadingToast = toast.loading('Přihlašování...');
		try {
			const result = await loginAction(data.email, data.password);

			if (result.success) {
				toast.success('Přihlášení proběhlo úspěšně!', {
					id: loadingToast, // Nahradí loading toast
				});
				router.push('/dashboard');
				router.refresh();
			} else {
				toast.error(
					result.error?.message || 'Přihlášení se nezdařilo.',
					{
						id: loadingToast,
					}
				);
			}
		} catch (err) {
			toast.error('Došlo k neočekávané chybě.', {
				id: loadingToast,
			});
			console.error('[LOGIN_ERROR]', err);
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
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{/* Email field */}
					<FormField
						name='email'
						label='E-mail'
						type='email'
						placeholder='vas@email.cz'
						register={register}
						error={errors.email}
						disabled={isSubmitting}
						required
					/>

					{/* Password field */}
					<FormField
						name='password'
						label='Heslo'
						type='password'
						placeholder='••••••••'
						register={register}
						error={errors.password}
						disabled={isSubmitting}
						required
					/>

					{/* Submit button */}
					<Button
						type='submit'
						className='w-full'
						disabled={isSubmitting}>
						{isSubmitting ? 'Přihlašování...' : 'Přihlásit se'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
