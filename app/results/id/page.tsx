'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
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
import { cn } from '@/lib/utils';

const formSchema = z.object({
	id: z.coerce.number().int().positive()
});

export default function PageResultID() {
	const [dataT, setData] = useState(false);

	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<{ id: number }>({
		resolver: zodResolver(formSchema),
		defaultValues: { id: 0 },
	});

	const onSubmit = async (formData: { id: number }) => {
		setData(false);
		setIsLoading(true);
		try {
			const { data } = await api.get('/scan/result/', { params: formData });
			if (data) {
				router.push(`/results/${data.id}`);
			}
			setIsLoading(false);
		} catch (error) {
			console.error('Ошибка запроса:', error);
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 404) {
					setData(true);
					setIsLoading(false);
				}
			}
		}
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Последнее сканирование по ID</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className={cn(
						"w-full max-w-lg space-y-6",
						isLoading && 'pointer-events-none opacity-50'
					)}>
					<FormField
						control={form.control}
						name="id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ID сканирования</FormLabel>
								<FormControl>
									<Input placeholder="52" {...field} />
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
								Посмотреть результат
								<ArrowRight />
							</>
						)}
					</Button>
				</form>
			</Form>
			{dataT && <p className="mt-4">Результатов не найдено</p>}
		</div>
	);
}
