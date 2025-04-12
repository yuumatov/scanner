'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import api from '@/lib/axiosClient';

const formSchema = z.object({
	id: z.number({ message: 'Введите корректный ID' }).min(1, { message: 'Введите корректный ID' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function IDForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: undefined,
		},
	});

	const onSubmit = async (formData: FormValues) => {
		try {
			await api.get('/scan/result/', formData);
		} catch (error) {
			console.log('Ошибка!', error);
		}
	};

	return (
		<div className="p-4 max-w-lg">
			<h1 className="text-2xl font-bold mb-4">Сканирование #999</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ID сканирования</FormLabel>
								<FormControl>
									<Input type="number" placeholder="1234" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">
						Посмотреть сканирование
						<ArrowRight />
					</Button>
				</form>
			</Form>
		</div>
	);
}
