'use client'

import ScanItem from "./scan-item";
import api from '@/lib/axiosClient';

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

async function getData() {
	try {
		const result = await api.get(`/user/scans`);
		return result.data;
	} catch (error) {
		console.error('Error fetching data:', error);
		return [];
	}
}

export default function ScanList() {
	const [scans, setScans] = useState([]);
	const [selectedSite, setSelectedSite] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			const data = await getData();
			setScans(data.reverse());
		}
		fetchData();
	}, [])

	if (Array.isArray(scans)) {
		const testedSites = [...new Set(scans.map(scan => scan.input_url))];
		const filteredScans = selectedSite ? scans.filter(scan => scan.input_url === selectedSite) : scans;

		return (
			<div className="container mx-auto space-y-4">
				{testedSites.length > 0 && (
					<Select onValueChange={(val) => {
						setSelectedSite(val === "__all__" ? "" : val)
					}}>
						<SelectTrigger className="w-[240px]">
							<SelectValue placeholder="Выбрать сайт" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="__all__">Все сайты</SelectItem>
							{testedSites.map((item, index) => (
								<SelectItem key={index} value={item}>{item}</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				{filteredScans.length > 0 ? (
					filteredScans.map((scan) => (
						<ScanItem key={scan.id} scan={scan} />
					))
				) : (
					<div>Не найдено результатов сканирования</div>
				)}
			</div>
		)
	} else {
		return (
			<div className="container mx-auto py-6 space-y-4">
				Не найдено результатов сканирования
			</div>
		)
	}
}
