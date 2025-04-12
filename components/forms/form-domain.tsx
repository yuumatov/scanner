'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/axiosClient';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
	url: z.string().url({ message: 'Введите корректный URL' }),
});

export default function FormDomain({ endpoint, btnValue, callback }: { endpoint: string, btnValue: string }) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<{ url: string }>({
		resolver: zodResolver(formSchema),
		defaultValues: { url: '' },
	});

	const onSubmit = async (formData: { url: string }) => {
		setIsLoading(true);
		try {
			const { data } = await api.get(endpoint, { params: formData });
			callback(data);
			setIsLoading(false);
		} catch (error) {
			console.error('Ошибка запроса:', error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn(
					"w-full max-w-lg space-y-6",
					isLoading && 'pointer-events-none opacity-50'
				)}>
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ссылка на сайт</FormLabel>
							<FormControl>
								<Input placeholder="https://example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className={cn(isLoading && 'pointer-events-none')}>
					{isLoading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Получение данных
						</>
					) : (
						<>
							{btnValue}
							<ArrowRight />
						</>
					)}
				</Button>
			</form>
		</Form>
	);
}