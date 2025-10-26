// Cesta: frontend/src/app/(protected)/components/Sidebar.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<aside
			className={`${
				collapsed ? 'w-16' : 'w-60'
			} bg-background border-r flex flex-col transition-all duration-200`}>
			<div className='h-14 flex items-center justify-between px-3 border-b'>
				<span className='font-semibold text-sm'>Menu</span>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => setCollapsed(!collapsed)}
					aria-label='Toggle sidebar'>
					<Menu className='h-4 w-4' />
				</Button>
			</div>

			<nav className='flex-1 p-2 text-sm'>
				<ul className='space-y-1'>
					<li>
						<a
							href='#'
							className='block rounded-md px-2 py-1 hover:bg-muted'>
							Dashboard
						</a>
					</li>
					<li>
						<a
							href='#'
							className='block rounded-md px-2 py-1 hover:bg-muted'>
							Uživatelé
						</a>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
