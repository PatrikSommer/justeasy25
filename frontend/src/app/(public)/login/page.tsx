// Cesta: frontend/src/app/(public)/login/page.tsx

import LoginForm from './components/LoginForm';

export default function LoginPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-muted/30'>
			<div className='w-full max-w-md'>
				<h1 className='text-center text-2xl font-semibold mb-6'>
					Přihlášení do systému Justeasy
				</h1>
				<LoginForm />
			</div>
		</div>
	);
}
