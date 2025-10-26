// Cesta: frontend/src/app/(protected)/layout.tsx

import Sidebar from '@/app/(protected)/components/Sidebar';
import Navbar from '@/app/(protected)/components/Navbar';

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex min-h-screen bg-muted/10'>
			<Sidebar />
			<div className='flex-1 flex flex-col'>
				<Navbar />
				<main className='flex-1 p-6'>{children}</main>
			</div>
		</div>
	);
}
