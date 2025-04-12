'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useSelectedLayoutSegments } from 'next/navigation';

export default function Breadcrumbs() {
	const segments = useSelectedLayoutSegments();

	const alias = {
		scanner: 'Сканирование',
		domain: 'Сайта',
		page: 'Страницы',
		id: 'ID',
		history: 'История',
		robot_txt: 'robot.txt',
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.map((segment, index) => (
					<>
						<BreadcrumbItem key={index} className="hidden md:block">
							<BreadcrumbLink href="#">{alias[segment]}</BreadcrumbLink>
						</BreadcrumbItem>
						{segments.length !== index + 1 && <BreadcrumbSeparator className="hidden md:block" />}
					</>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
