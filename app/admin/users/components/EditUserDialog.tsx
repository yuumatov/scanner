// src/app/(dashboard)/users/components/AddUserDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserForm, UserFormValues } from "@/components/forms/user-form";
import api from "@/lib/axiosClient";

export function EditUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      setLoading(true);
      console.log("Submitting user:", values);
      const response = await api.post('/admin/user/change_info', values);
      console.log(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Редактировать</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogDescription className="sr-only">Форма редактирования пользователя</DialogDescription>
        </DialogHeader>
        <UserForm onSubmit={handleSubmit} loading={loading} />
      </DialogContent>
    </Dialog>
  );
}