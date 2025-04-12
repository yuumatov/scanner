import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function role(id: number): string {
	const roleId = ['Суперадмин', 'Админ', 'Пользователь'];
	return roleId[id - 1] || 'Неизвестная роль';
}
