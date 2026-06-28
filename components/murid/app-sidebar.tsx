// components/murid/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconCalendar,
  IconTrophy,
  IconCertificate,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { NavUser } from "@/components/murid/nav-user";
import { VersionSwitcher } from "@/components/murid/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Kelas & Jadwal",
    items: [
      { title: "Kelas", url: "/murid/kelas", icon: IconLayoutDashboard },
      { title: "Jadwal", url: "/murid/jadwal", icon: IconCalendar },
    ],
  },
  {
    label: "Prestasi & Sabuk",
    items: [
      { title: "Prestasi", url: "/murid/prestasi", icon: IconTrophy },
      { title: "History Sabuk", url: "/murid/ujian-sabuk", icon: IconCertificate },
    ],
  },
  {
    label: "Pengumuman",
    items: [
      { title: "Lihat Pengumuman", url: "/murid/pengumuman", icon: IconSpeakerphone },
    ],
  },
];

// Tetap ada untuk VersionSwitcher (tidak diubah)
const data = {
  navMain: [
    {
      title: "Kelas dan Jadwal",
      url: "/murid/kelas",
      items: [
        { title: "Kelas", url: "/murid/kelas" },
        { title: "Jadwal", url: "/murid/jadwal" },
      ],
    },
    {
      title: "Rekap Prestasi dan Sabuk",
      url: "/murid/jadwal",
      items: [
        { title: "Prestasi", url: "/murid/prestasi" },
        { title: "History Sabuk", url: "/murid/ujian-sabuk" },
      ],
    },
    {
      title: "Pengumuman",
      url: "/murid/ujian",
      items: [{ title: "Lihat Pengumuman", url: "/murid/pengumuman" }],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="mb-2">
        <VersionSwitcher navMain={data.navMain} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-1 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-3">
            {/* Section label */}
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
              {group.label}
            </p>

            {/* Menu items */}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  pathname.startsWith(item.url + "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary" />
                    )}
                    <Icon size={15} className="shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}