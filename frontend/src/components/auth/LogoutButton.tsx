// Cesta: frontend/src/components/auth/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function LogoutButton() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		setLoading(true);

		try {
			await logoutAction();
			toast.success('Byl jste úspěšně odhlášen');

			// Redirect na login
			router.push('/login');
			router.refresh(); // Refresh pro vyčištění cache
		} catch (error) {
			toast.error('Chyba při odhlašování');

			console.error('Logout error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			variant='outline'
			size='sm'
			onClick={handleLogout}
			disabled={loading}>
			{loading ? 'Odhlašování...' : 'Odhlásit se'}
		</Button>
	);
}
