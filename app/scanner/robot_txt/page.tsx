'use client';

import FormDomain from "@/components/forms/form-domain";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useState } from "react";

export default function PageRobotTxt() {
	const [data, setData] = useState([]);

	const handleData = (responseData) => {
		setData(responseData);

		if (responseData.length == 0) {
			setData({
				links: null,
				message: 'Файл robot.txt не найден'
			})
		} else {
			setData({
				links: responseData,
				message: 'Адреса страниц из robot.txt'
			})
		}
  };

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Получить robot.txt</h1>
			<FormDomain endpoint="/scan/site/robots" btnValue="Получить" callback={handleData} />
			<div className="font-bold mt-8 mb-2">{data.message}</div>
			{data?.links && (
				<ScrollArea className="h-[200px] max-w-lg rounded-md border p-4">
					{data?.links?.map((item, index) => {
						return <div key={index}>{item}</div>
					})}
				</ScrollArea>
			)}
		</div>
	);
}
