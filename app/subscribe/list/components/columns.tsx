"use client"

import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import api from '@/lib/axiosClient';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const unsubcribe = async (id: number, router) => {
  try {
    const result = await api.delete(`/scan/subscribe`, { data: { id: id } });
    router.refresh();
    return result.data;
  } catch {
    console.log('Произошла ошибка!');
  }
}

export const columns = [
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
    accessorKey: "user_id",
    header: "ID Пользователя",
  },
  {
    accessorKey: "url",
    header: "Ссылка на сайт",
    cell: function CellComponent({ row }) {
      const item = row.original;

      return(
        <a href={item.url} target="_blank">{item.url}</a>
      )
    }
  },
  {
    accessorKey: "mailers",
    header: "Почта (ы)",
    cell: function CellComponent({ row }) {
      const item = row.original;

      return (
        item.mailers.map((mail, index) => {
          return(
            <div className="flex flex-col" key={index}>
              <span>{mail}</span>
            </div>
          )
        })
      );
    }
  },
  {
    accessorKey: "cron",
    header: "Рассылка",
    cell: function CellComponent({ row }) {
      const item = row.original;

      return (
        <div className="flex flex-col">
          <span>day: {item.cron.day}</span>
          <span>hour: {item.cron.hour}</span>
          <span>minute: {item.cron.minute}</span>
        </div>
      );
    }
  },
	{
    id: "actions",
    cell: function CellComponent({ row }) {
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem  onClick={() => unsubcribe(row.original?.id, router)}>Отписаться</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

