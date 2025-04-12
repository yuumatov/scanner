'use client';

import FormDomain from "@/components/forms/form-domain";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PageResultDomain() {
	const [data, setData] = useState(false);

	const router = useRouter();

	const handleData = (responseData) => {
		if (responseData.length == 0) {
			setData(true);
		} else if (responseData[0].id) {
			router.push(`/results/${responseData[0].id}`);
		}
  };

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Последнее сканирование сайта</h1>
			<FormDomain endpoint="/scan/site/last" btnValue="Посмотреть результат" callback={handleData} />
			{data && <p className="mt-4">Результатов не найдено</p>}
		</div>
	);
}
