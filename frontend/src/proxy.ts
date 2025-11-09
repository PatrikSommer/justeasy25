// Cesta: frontend/src/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy funkce pro ochranu chráněných routes
 *
 * V Next.js 16+ se používá 'proxy' místo 'middleware'
 */

export function proxy(request: NextRequest) {
	const accessToken = request.cookies.get('accessToken');

	if (!accessToken) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('from', request.nextUrl.pathname);

		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'],
};
