// Cesta: frontend/src/app/(protected)/components/Navbar.tsx

'use client';

import { Button } from '@/components/ui/button';

export default function Navbar() {
	return (
		<header className='h-14 border-b flex items-center justify-between px-4 bg-background'>
			<h1 className='text-lg font-semibold'>Justeasy</h1>
			<Button variant='ghost' size='sm'>
				Odhlásit
			</Button>
		</header>
	);
}
