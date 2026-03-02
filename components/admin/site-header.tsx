// components\admin\site-header.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ChevronDown, Check } from "lucide-react";

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

export function SiteHeader() {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const roles: string[] = user?.roles ?? [];
  const hasMultipleRoles = roles.length > 1;

  const activeRole =
    roles.find((role) => pathname.startsWith(ROLE_ROUTES[role])) ?? roles[0];

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>

        <div className="ml-auto flex items-center gap-2">
          {hasMultipleRoles && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {ROLE_LABELS[activeRole] ?? activeRole}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Ganti Dashboard
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => router.push(ROLE_ROUTES[role])}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{ROLE_LABELS[role] ?? role}</span>
                    {role === activeRole && (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
