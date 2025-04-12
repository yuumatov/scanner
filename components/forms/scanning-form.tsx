'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, ArrowRight, Loader2, Terminal, NotepadText } from 'lucide-react';
import api from '@/lib/axiosClient';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import LogViewer from '../log-viewer';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  url: z.string().url({ message: 'Введите корректный URL' }),
  delay: z.number().min(0).optional(),
  mailers: z.array(z.string().email({ message: 'Введите корректный email' })).default([]),
});

type FormValues = z.infer<typeof formSchema>;

export default function ScanningForm({ domain = true }: { domain?: boolean }) {
  const [scanResult, setScanResult] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [id, setId] = useState(null);
  const [someState, setSomeState] = useState([]);
  const ws = useRef(null);

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      delay: 0,
      mailers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'mailers',
  });

  const onSubmit = async (formData: FormValues) => {
    setIsConnected(true);
    setScanResult({});
    setSomeState([]);
    const url = domain ? '/scan/site' : '/scan/page'; 
    try {
      const { data } = await api.post(url, formData);
      if (data) {
        setId(data?.id);
        connectWebSocket(data);
      }
    } catch (error) {
      console.log('Ошибка подключения к вебсокету', error);
    }
  };

  const connectWebSocket = (data) => {
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(`wss://${process.env.NEXT_PUBLIC_API_URL_NO_PROTOCOL}/ws/listener/${data?.hash_code}`);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setSomeState(prevState => [...prevState, parsed]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setScanResult({
        success: true,
        msg: 'Сканирование завершено успешно, сейчас вы перенаправитесь на страницу результата'
      });
      const resultId = data?.id;
      setTimeout(() => {
        router.push(`/results/${resultId}`);
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setScanResult({
        success: false,
        msg: 'Произошла ошибка при сканировании, попробуйте позже'
      });
    };
  };

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Сканирование {domain ? 'сайта' : 'страницы'}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
          <div className={cn(
              'space-y-6',
              isConnected && 'pointer-events-none opacity-50'
            )}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на {domain ? 'сайт' : 'страницу'}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Задержка (в секундах)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col items-start'>
              <FormLabel>Email для результата (необязательно)</FormLabel>
              
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`mailers.${index}`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className="flex items-center space-x-2 mt-2">
                        <FormControl>
                          <Input {...field} placeholder="example@email.com" className='flex-auto' />
                        </FormControl>
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
                onClick={() => append('')}
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
      </Form>
      {someState.length !== 0 && (
        <LogViewer logs={someState} />
      )}
      {JSON.stringify(scanResult) !== '{}' && (
        <div className='max-w-lg'>
          <Alert className='mt-4' variant={!scanResult?.success && 'destructive'}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{scanResult?.msg}</AlertTitle>
          </Alert>
          {scanResult?.success && (
            <Button type='button' className='mt-2' asChild>
              <Link href={`/results/${id}`}>
                <NotepadText />
                Посмотреть результат
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}