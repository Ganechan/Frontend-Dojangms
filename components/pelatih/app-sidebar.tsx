// components/pelatih/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconCalendar,
  IconClipboardCheck,
  IconClipboardList,
  IconHistory,
  IconTrophy,
  IconEdit,
  IconCertificate,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { NavUser } from "@/components/pelatih/nav-user";
import { VersionSwitcher } from "@/components/pelatih/version-switcher";
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
      { title: "Kelas", url: "/pelatih/kelasJadwal", icon: IconLayoutDashboard },
      { title: "Jadwal", url: "/pelatih/jadwal", icon: IconCalendar },
    ],
  },
  {
    label: "Absensi",
    items: [
      { title: "Absensi", url: "/pelatih/absensi", icon: IconClipboardCheck },
      { title: "Edit Absensi", url: "/pelatih/absensi/edit", icon: IconEdit },
      { title: "Riwayat Absensi", url: "/pelatih/absensi/history", icon: IconHistory },
    ],
  },
  {
    label: "Kejuaraan",
    items: [
      { title: "Input Hasil", url: "/pelatih/kejuaraan", icon: IconTrophy },
      { title: "Edit Hasil", url: "/pelatih/editKejuaraan", icon: IconEdit },
    ],
  },
  {
    label: "Ujian Kenaikan Sabuk",
    items: [
      { title: "Input Ujian", url: "/pelatih/ujian", icon: IconCertificate },
      { title: "Edit Ujian", url: "/pelatih/editUjian", icon: IconClipboardList },
    ],
  },
  {
    label: "Pengumuman",
    items: [
      { title: "Baca Pengumuman", url: "/pelatih/pengumuman", icon: IconSpeakerphone },
    ],
  },
];

// Tetap ada untuk VersionSwitcher (tidak diubah)
const data = {
  navMain: [
    {
      title: "Kelas dan Jadwal",
      url: "/pelatih/kelasJadwal",
      items: [
        { title: "Kelas", url: "/pelatih/kelasJadwal" },
        { title: "Jadwal", url: "/pelatih/jadwal" },
      ],
    },
    {
      title: "Absensi Murid",
      url: "/pelatih/absensi",
      items: [
        { title: "Absensi", url: "/pelatih/absensi" },
        { title: "Edit Absensi", url: "/pelatih/absensi/edit" },
        { title: "Riwayat Absensi", url: "/pelatih/absensi/history" },
      ],
    },
    {
      title: "Hasil Kejuaraan",
      url: "/pelatih/kejuaraan",
      items: [
        { title: "Input Hasil", url: "/pelatih/kejuaraan" },
        { title: "Edit Hasil", url: "/pelatih/editKejuaraan" },
      ],
    },
    {
      title: "Hasil Ujian Kenaikan Sabuk",
      url: "/pelatih/ujian",
      items: [
        { title: "Input Ujian Kenaikan Sabuk", url: "/pelatih/ujian" },
        { title: "Edit Ujian Kenaikan Sabuk", url: "/pelatih/editUjian" },
      ],
    },
    {
      title: "Pengumuman",
      url: "/pelatih/pengumuman",
      items: [{ title: "Baca Pengumuman", url: "/pelatih/pengumuman" }],
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/public/meguri.jpg",
  },
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