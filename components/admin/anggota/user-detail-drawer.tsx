"use client";

import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { User } from "./hooks/types";
import { formatDate } from "./hooks/utils";
import { BeltBadge } from "./belt-badge";

export function UserDetailDrawer({ user }: { user: User }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const status = String(user.status ?? "").toLowerCase();
  const isActive = status === "active";

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          Lihat Detail
        </Button>
      </DrawerTrigger>

      <DrawerContent className={isMobile ? "max-h-[85vh]" : "w-full max-w-md"}>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="break-words">Detail Murid</DrawerTitle>
          <DrawerDescription className="break-words">
            Informasi lengkap tentang {user.name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4">
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-3">
              <Label className="text-muted-foreground text-xs">
                Nama Lengkap
              </Label>
              <div className="break-words text-lg font-semibold">
                {user.name}
              </div>
            </div>

            <Separator />

            {/* Sabuk Saat Ini */}
            <div className="flex flex-col gap-3">
              <Label className="text-muted-foreground text-xs">
                Sabuk Saat Ini
              </Label>
              <div>
                <BeltBadge belt={user.current_belt || "Putih"} />
              </div>
            </div>

            <Separator />

            {/* Email dan No. Telepon */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-xs">Email</Label>
                <div className="break-all text-sm">{user.email}</div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  No. Telepon
                </Label>
                <div className="break-words text-sm">{user.phone}</div>
              </div>
            </div>

            <Separator />

            {/* Tanggal Lahir dan Status */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  Tanggal Lahir
                </Label>
                <div className="break-words text-sm">
                  {formatDate(user.tanggal_lahir)}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">Status</Label>
                <div>
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
              </div>
            </div>

            <Separator />

            {/* Sabuk Dicapai dan Terdaftar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  Sabuk Dicapai
                </Label>
                <div className="break-words text-sm">
                  {user.belt_achieved_at
                    ? formatDate(user.belt_achieved_at)
                    : "-"}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  Terdaftar
                </Label>
                <div className="break-words text-sm">
                  {formatDate(user.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter>
          {/* sebelumnya hanya toast; sekarang diarahkan ke page edit yang sudah ada di columns.tsx */}
          <Button onClick={() => router.push(`/admin/user/edit/${user.id}`)}>
            Edit
          </Button>

          {/* optional: tetap kasih info cepat */}
          <Button
            variant="outline"
            onClick={() => toast.info(`Murid: ${user.name}`)}
            className="hidden"
          >
            Info
          </Button>

          <DrawerClose asChild>
            <Button variant="outline">Tutup</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
