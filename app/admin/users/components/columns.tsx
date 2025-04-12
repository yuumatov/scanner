"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useConfirmDialog } from '@/components/ConfirmDialog';
import api from '@/lib/axiosClient';
import { EditUserDialog } from "./EditUserDialog";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  id: number,
	login: string,
	user_type: number,
	name: string,
	surname?: string,
	patronymic?: string,
	isActive: boolean
}

const changeActivationUser = async (id: number, isActive: boolean, token: string, router) => {
  const bearer = 'Bearer ' + token;
  const data = { "user_id": id, "isActive": isActive }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/change_activation`, {
    method: 'PATCH',
    headers: {
      'Authorization': bearer,
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data)
  });
  if (response.ok) {
    router.refresh();
  }
}

// const changeActivationUser = (id: number) => {
//   console.log('Изменение активности');
// }

const editUserPassword = (id: number) => {
  console.log('Изменение пароля пользователя: ' + id);
}

const deleteUser = async (id: number, router) => {
  try {
    await api.delete('/admin/user', { data: { id: id } });
    router.refresh();
  } catch {
    console.log('Произошла ошибка при удалении пользователя');
  }
}

export const columns: ColumnDef<Users>[] = [
	{
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "login",
    header: "Логин",
  },
  {
    accessorKey: "user_type",
    header: "Тип пользователя",
  },
  {
    accessorKey: "name",
    header: "Имя"
  },
  {
    accessorKey: "surname",
    header: "Фамилия"
  },
  {
    accessorKey: "patronymic",
    header: "Отчество"
  },
  {
    accessorKey: "isActive",
    header: "Состояние"
  },
	{
    id: "actions",
    cell: function CellComponent({ row }) {
      const router = useRouter();
      const user = row.original;
      const { data: session } = useSession();
      const token = session?.access_token;

      const { showDialog } = useConfirmDialog();

      const handleDeleteClick = (id) => {
        showDialog(`Вы уверены, что хотите удалить данного пользователя`, () => {
          deleteUser(id);
        });
      };
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeActivationUser(user?.id, !user?.isActive, token, router)}>{user?.isActive ? 'Деактивировать' : 'Активировать'}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editUserPassword(user?.id)}>Изменить пароль</DropdownMenuItem>
            <DropdownMenuItem>
              <EditUserDialog/>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteClick(user?.id, router)}>Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

