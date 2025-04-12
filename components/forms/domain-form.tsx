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
	url: z.string().url({ message: 'Введите корректный URL' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DomainForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: '',
		},
	});

	const onSubmit = async (formData: FormValues) => {
		try {
			await api.get('/scan/site/list', formData);
		} catch (error) {
			console.log('Ошибка!', error);
		}
	};

	return (
		<div className="p-4 max-w-lg">
			<h1 className="text-2xl font-bold mb-4">История сканирования сайта</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

					<Button type="submit">
						Посмотреть историю
						<ArrowRight />
					</Button>
				</form>
			</Form>
		</div>
	);
}
