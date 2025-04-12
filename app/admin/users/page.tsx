import { Users, columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AddUserDialog } from "./components/AddUserDialog";

export const revalidate = 0;

async function getData(): Promise<Users[]> {
	const session = await getServerSession(authOptions);
	const token = session?.access_token;
	const bearer = 'Bearer ' + token;

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/list`, {
			method: 'GET',
			headers: {
				'Authorization': bearer,
				'Content-type': 'application/json; charset=UTF-8',
			},
		});

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
		const sortedData = [...data].sort((a, b) => a.id - b.id);
    return sortedData as Users[];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default async function PageUsers() {
  const data = await getData()

  return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Пользователи</h1>
				<AddUserDialog />

			</div>
			<div className="container mx-auto">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
  )
}