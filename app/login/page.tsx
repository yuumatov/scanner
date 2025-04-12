'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

const formSchema = z.object({
  login: z.string().min(3, 'Минимум 3 символа'),
  password: z.string().min(3, 'Минимум 3 символа'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginComponent />
    </Suspense>
  );
}

function LoginComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      const res = await signIn("credentials", {
        redirect: false,
        login: data.login,
        password: data.password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        const callbackUrl = searchParams.get('callbackUrl') || '/scanner/domain';
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Что-то пошло не так");
      console.error(err);
    }
  };

  return (
    <div className="p-4 w-full max-w-[420px]">
      <h1 className="text-2xl font-bold mb-4">Авторизация</h1>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Логин</FormLabel>
                <FormControl>
                  <Input placeholder="Логин" autoComplete="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Пароль" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Войти
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
}