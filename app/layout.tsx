'use client'
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { ConfirmDialogProvider } from '@/components/ConfirmDialog';
import { ModeToggle } from '@/components/mode-toggle';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { useTheme } from 'next-themes';
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { theme } = useTheme();

	return (
		<html lang="ru" suppressHydrationWarning>
			<body className={`antialiased`}>
				<SessionProvider>
					<ConfirmDialogProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
									<header className="flex h-16 shrink-0 items-center gap-2">
										<div className="w-full flex items-center gap-2 px-4">
											<SidebarTrigger className="-ml-1" />
											<Separator orientation="vertical" className="mr-2 h-4" />
											{/* <Breadcrumbs /> */}
											<ModeToggle />
										</div>
									</header>
									<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
										{children}
									</div>
								</SidebarInset>
							</SidebarProvider>
							<NextTopLoader
								color={theme == 'dark' ? '#ffffff' : '#171717'}
								showSpinner={false}
							/>
							<Toaster />
						</ThemeProvider>
					</ConfirmDialogProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
