import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				login: { label: 'Login', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
					method: 'POST',
					body: JSON.stringify({
						login: credentials?.login,
						password: credentials?.password,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (res.status === 401) {
					throw new Error('Неверный пароль');
				} else if (res.status === 404) {
					throw new Error('Неверный логин');
				} else if (!res.ok) {
					throw new Error(`Ошибка: ${res.statusText}`);
				}

				const data = await res.json();
				if (data.access_token) {
					return {
						access_token: data.access_token,
						user: data.user, // Добавляем данные пользователя
					};
				} else {
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: '/login/',
	},
	callbacks: {
		async jwt({ token, user }) {
			// При первом входе добавляем и access_token и данные пользователя в токен
			if (user) {
				token.access_token = user.access_token;
				token.user = user.user;
			}
			return token;
		},
		async session({ session, token }) {
			// Добавляем и access_token и данные пользователя в сессию
			if (token) {
				session.access_token = token.access_token;
				session.user = token.user;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
