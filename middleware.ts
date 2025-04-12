import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const currentPath = url.pathname;
	const guestParam = url.searchParams.get("guest");

	const protectedPaths = ['/scanner', '/history', '/subscribe', '/results'];

	// Разрешить доступ к /results/* если есть guest
	if (currentPath.startsWith('/results') && guestParam) {
		return NextResponse.next(); // пропускаем
	}

	if (protectedPaths.some((path) => currentPath.startsWith(path))) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		if (!token) {
			url.pathname = '/login';
			return NextResponse.redirect(url);
		}
	}

	if (currentPath.startsWith('/admin')) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		if (!token) {
			url.pathname = '/login';
			return NextResponse.redirect(url);
		}

		if (token.user.user_type === 3) {
			url.pathname = '/unauthorized';
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/scanner/:path*',
		'/history/:path*',
		'/admin/:path*',
		'/subscribe/:path*',
		'/results/:path*', // добавляем для применения middleware
	],
};
