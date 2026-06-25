// components\admin\version-switcher.tsx
"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  LayoutDashboard,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useRouter, usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  pelatih: "Pelatih",
  murid: "Murid",
};

const ROLE_ROUTES: Record<string, string> = {
  admin: "/admin",
  pelatih: "/pelatih",
  murid: "/murid",
};

type NavItem = { title: string; url: string };
type NavGroup = { title: string; url: string; items: NavItem[] };

export function VersionSwitcher({ navMain }: { navMain: NavGroup[] }) {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const roles: string[] = user?.roles ?? [];
  const hasMultipleRoles = roles.length > 1;
  const activeRole =
    roles.find((role) => pathname.startsWith(ROLE_ROUTES[role])) ?? roles[0];

  // Tampilkan label role sebagai display group
  const displayGroup = ROLE_LABELS[activeRole] ?? "Dashboard";

  // Cari item aktif dari navMain
  const activeItem = navMain
    .flatMap((group) => group.items)
    .find((item) => pathname.startsWith(item.url));

  const displayItem = activeItem?.title ?? "Pilih Menu";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">{displayGroup}</span>
                <span className="text-xs text-muted-foreground">
                  {displayItem}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {hasMultipleRoles && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Ganti Dashboard
                </DropdownMenuLabel>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onSelect={() => router.push(ROLE_ROUTES[role])}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{ROLE_LABELS[role] ?? role}</span>
                    {role === activeRole && (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
