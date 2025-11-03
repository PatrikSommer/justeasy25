// Cesta: frontend/src/app/(dashboard)/layout.tsx

import { getCurrentUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const result = await getCurrentUser();

	if (!result.success || !result.data) {
		redirect('/login');
	}

	const { user } = result.data;

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='bg-white border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						{/* Logo / Název */}
						<div className='flex items-center'>
							<h1 className='text-xl font-bold text-gray-900'>
								Justeasy
							</h1>
						</div>

						{/* User info + Logout */}
						<div className='flex items-center gap-4'>
							<span className='text-sm text-gray-700'>
								{user.firstName} {user.lastName}
							</span>
							<span className='text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded'>
								{user.role}
							</span>
							<LogoutButton />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{children}
			</main>
		</div>
	);
}
