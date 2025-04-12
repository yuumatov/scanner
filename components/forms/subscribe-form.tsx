'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/axiosClient';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  url: z.string().url({ message: 'Введите корректный URL' }),
  mailers: z.array(z.string().email({ message: 'Введите корректный email' })).min(1, { message: 'Необходимо указать хотя бы один email' }),
  interval: z.number({ message: 'Укажите интервал сканирования' }).min(1, { message: 'Минимальный интервал 1 день' }),
  time: z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Пожалуйста, введите время в формате ЧЧ:MM'
  })
});

function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}

type FormValues = z.infer<typeof formSchema>;

export default function SubscribeForm() {
  const [isConnected, setIsConnected] = useState(false);
  const [result, setResult] = useState();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      mailers: [''],
      interval: 1,
      time: ''
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'mailers',
  });

  const onSubmit = async (formData: FormValues) => {
    setIsConnected(true);
    setResult('');
    const url = '/scan/subscribe'; 
    try {
      const { data } = await api.post(url, formData);
      if (data instanceof String || isString(data)) {
        form.reset({
          url: '',
          mailers: [''],
          interval: 1,
          time: ''
        });
        setResult('Вы успешно подписались на рассылку');
      }
    } catch (error) {
      console.log(error?.response?.data?.error);
      if (error?.response?.data?.error) {
        setResult(error?.response?.data?.error);
        console.log(error?.response?.data?.error);
      } else {
        setResult('Ну удалось подписаться на рассылку, попробуйте позже');
        console.log('Ошибка при попытке подписаться на рассылку');
      }
    } finally {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (fields.length === 0) {
      append('');
    }
  }, [fields, append]);

  return (
    <div className="p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Подписка на сканирование</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={cn(
              'space-y-6',
              isConnected && 'pointer-events-none opacity-50'
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

            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Интервал сканирования (в днях)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Время сканирования</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col items-start'>
              <FormLabel>Email для результата</FormLabel>
              
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`mailers.${index}`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className="flex items-center space-x-2 mt-2">
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="example@email.com" 
                            className='flex-auto' 
                          />
                        </FormControl>
                        {/* Кнопка удаления скрыта, если это единственное поле */}
                        {fields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => remove(index)}
                            aria-label="Удалить email"
                            className='flex-shrink-0'
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => append("")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Добавить email
              </Button>
            </div>
          </div>
          <Button type="submit" className={cn(isConnected && 'pointer-events-none')}>
            {isConnected ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Сканирование
              </>
            ) : (
              <>
                Запустить сканирование
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
        {result && (
          <p className='mt-4'>{result}</p>
        )}
      </Form>
    </div>
  );
}