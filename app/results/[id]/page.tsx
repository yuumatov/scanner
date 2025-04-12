import { serverApi } from "@/lib/axiosClient";
import Scan from "@/components/scan";

// Обновлённый getData с поддержкой guest
async function getData(id: number, guest?: string) {
	try {
		if (guest) {
			const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`.replace(/\/$/, "");
			const url = `${baseUrl}/scan/result/?id=${id}&guest=${guest}`;

			const res = await fetch(url, {
				method: "GET",
				cache: "no-store",
			});

			if (!res.ok) throw new Error("Failed to fetch (guest)");
			return await res.json();
		}

		const api = await serverApi();
		const result = await api.get(`/scan/result/`, { params: { id } });
		return result.data;

	} catch (error) {
		console.error("Error fetching data:", error);
		return [];
	}
}

// Типизируем searchParams
type PageResultsProps = {
	params: { id: string };
	searchParams: { guest?: string };
};

export default async function PageResults({ params, searchParams }: PageResultsProps) {
	const id = parseInt(params.id);
	const guest = searchParams?.guest;

	const data = await getData(id, guest);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">
				Результат сканирования ID: {id}
			</h1>
			<Scan scan={data} />
		</div>
	);
}
