'use client';

import { User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

export function NavUser({ user }) {
	if (user) {
		return (
			<>
				<div className="flex items-center gap-4 mb-2">
					<User size={30} className="bg-muted rounded-[50%] p-1" />
					<span className="text-sm">{user?.name}</span>
				</div>
				<Button onClick={() => signOut({ callbackUrl: '/' })}>
					<LogOut />
					Выйти
				</Button>
			</>
		);
	}
}
