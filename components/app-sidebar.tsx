import * as React from 'react';
import { User, SearchCode, ScanSearch, FileScan, History, MailCheck, Mailbox  } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { useSession } from 'next-auth/react';

const data = [
	{
		title: 'Сканирование сайта',
		url: '/scanner/domain',
		icon: ScanSearch
	},
	{
		title: 'Результат сканирования',
		url: '/results/domain',
		icon: FileScan
	},
	{
		title: 'История сканирования',
		url: '/history/domain',
		icon: History
	},
	{
		title: 'Подписка',
		url: '/subscribe/go',
		icon: MailCheck
	},
	{
		title: 'Мои подписки',
		url: '/subscribe/list',
		icon: Mailbox
	},
];

const dataAdmin = [
	{
		title: 'Пользователи',
		url: '/admin/users',
		icon: User
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const {data: session} = useSession();
	const role = session?.user?.user_type;
	let dataFinal;

	if (role === 1 || role === 2) {
		dataFinal = [...dataAdmin, ...data];
	} else {
		dataFinal = data;
	}

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href={'/'}>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<SearchCode className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="truncate font-semibold">Сканирование сайта</span>
									<span className="truncate text-xs">v1.0.0</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="gap-2">
						{dataFinal.map((item, index) => (
							<SidebarMenuItem key={index}>
								<SidebarMenu className="ml-0 border-l-0 px-1.5">
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={item.isActive}>
											<Link href={item.url}>
												<item.icon />
												{item.title}
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={session?.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
