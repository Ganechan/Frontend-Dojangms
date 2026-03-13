// components\admin\user\columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { User } from "./hooks/types";
import { formatDate } from "./hooks/utils";
import { BeltBadge } from "./belt-badge";
import { UserDetailDrawer } from "./user-detail-drawer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

async function softDeleteUser(userId: number) {
  // Disarankan pakai relative URL kalau endpoint ada di app yang sama:
  // const url = `/api/admin/softdelete/user/${userId}`;
  const url = `${BASE_URL}/api/admin/softdelete/user/${userId}`;

  const res = await fetch(url, {
    method: "PATCH",
    cache: "no-store",
  });

  if (!res.ok) {
    let message = "Gagal menonaktifkan user";
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res;
}

function ActionCell({
  user,
  onSoftDeleteSuccess,
}: {
  user: User;
  onSoftDeleteSuccess?: () => void;
}) {
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/user/edit/${user.id}`);
  };

  const handleSoftDelete = async () => {
    setDeleting(true);
    try {
      await softDeleteUser(user.id);

      // ✅ Sonner (shadcn) notif sukses
      toast.success(`User "${user.name}" berhasil dinonaktifkan`);

      // Karena page.tsx adalah client component, router.refresh saja tidak memicu fetchUsers.
      // Jadi trigger refetch via callback:
      onSoftDeleteSuccess?.();

      // Optional: tetap refresh untuk sinkron UI lain (aman)
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menonaktifkan user",
      );
    } finally {
      setDeleting(false);
      setOpenConfirm(false);
    }
  };

  return (
    <>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menonaktifkan user{" "}
              <span className="font-semibold text-foreground">{user.name}</span>
              ? Status user akan berubah menjadi{" "}
              <span className="font-semibold">inactive</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Memproses..." : "Ya, Nonaktifkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-center gap-2">
        <UserDetailDrawer user={user} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Buka Menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleEdit}>
              <IconPencil className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setOpenConfirm(true)}
            >
              <IconTrash className="size-4 mr-2" />
              Nonaktifkan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export function getColumns({
  onSoftDeleteSuccess,
}: {
  onSoftDeleteSuccess?: () => void;
}): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: () => <div className="text-center">Nama</div>,
      cell: ({ row }) => (
        <div className="font-medium text-left">{row.original.name}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">Email</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="text-muted-foreground text-sm">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-center">No. Telepon</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="text-sm">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "tanggal_lahir",
      header: () => <div className="text-center">Tanggal Lahir</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="text-sm">
            {formatDate(row.original.tanggal_lahir)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "roles",
      header: () => <div className="text-center">Role</div>,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {row.original.roles && row.original.roles.length > 0 ? (
            row.original.roles.map((role) => (
              <Badge
                key={role}
                variant="outline"
                className="text-xs capitalize"
              >
                {role}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              -
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "current_belt",
      header: () => <div className="text-center">Sabuk</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <BeltBadge belt={row.original.current_belt || "Putih"} />
        </div>
      ),
    },
    {
      accessorKey: "belt_achieved_at",
      header: () => <div className="text-center">Sabuk Dicapai</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="text-muted-foreground text-sm">
            {formatDate(row.original.belt_achieved_at)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const isActive = row.original.status === "active";
        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`gap-1 px-2 text-xs ${
                isActive
                  ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                  : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
              }`}
            >
              {isActive ? (
                <IconCircleCheckFilled className="size-3 fill-green-500 dark:fill-green-400" />
              ) : (
                <IconLoader className="size-3 text-red-500" />
              )}
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: () => <div className="text-center">Terdaftar</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="text-muted-foreground text-sm">
            {formatDate(row.original.created_at)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }) => (
        <ActionCell
          user={row.original}
          onSoftDeleteSuccess={onSoftDeleteSuccess}
        />
      ),
      enableHiding: false,
    },
  ];
}
