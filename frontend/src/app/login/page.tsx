// Cesta: frontend/src/app/login/page.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-muted/30 p-4'>
			<Card className='w-full max-w-sm shadow-md'>
				<CardHeader>
					<CardTitle className='text-center text-lg font-semibold'>
						Přihlášení do systému
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form className='space-y-4'>
						<div className='space-y-1'>
							<Label htmlFor='email'>E-mail</Label>
							<Input
								id='email'
								type='email'
								placeholder='jan.novak@example.com'
								required
							/>
						</div>

						<div className='space-y-1'>
							<Label htmlFor='password'>Heslo</Label>
							<Input
								id='password'
								type='password'
								placeholder='••••••••'
								required
							/>
						</div>

						<Button className='w-full mt-2' type='submit'>
							Přihlásit se
						</Button>
					</form>

					<div className='text-center text-sm text-muted-foreground mt-4'>
						<a href='/forgot-password' className='hover:underline'>
							Zapomenuté heslo?
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
