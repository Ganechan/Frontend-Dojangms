// components\admin\app-sidebar.tsx
"use client";

import * as React from "react";
import {
  IconUsers,
  IconCalendar,
  IconCertificate,
  IconTrophy,
  IconSpeakerphone,
  IconSettings,
  IconClipboardList,
  IconHistory,
  IconUserPlus,
  IconSchool,
  IconCalendarOff,
  IconAward,
  IconBell,
  IconUsersGroup,
  IconShieldCheck,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { VersionSwitcher } from "@/components/admin/version-switcher";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "Manajemen Anggota",
      url: "admin/anggota",
      items: [
        { title: "Data Murid", url: "/admin/anggota/murid" },
        { title: "Data Pelatih", url: "/admin/anggota/pelatih" },
        { title: "Data Admin", url: "/admin/anggota/admin" },
        { title: "Buat Data User Baru", url: "/admin/anggota/addUser" },
      ],
    },
    {
      title: "Kelas dan Jadwal Latihan",
      url: "/admin/jadwal",
      items: [
        { title: "Jadwal Latihan", url: "/admin/jadwal/jadwal" },
        { title: "Jadwal Libur Latihan", url: "/admin/libur" },
        { title: "Jadwal Libur Global", url: "/admin/liburGlobal" },
        { title: "Buat Jadwal Latihan", url: "/admin/jadwal/create" },
        { title: "Daftar Kelas", url: "/admin/kelas" },
        { title: "Tambah Murid Kelas", url: "/admin/kelas/addMurid" },
        { title: "Tambah Pelatih Kelas", url: "/admin/kelas/addPelatih" },
      ],
    },
    {
      title: "Ujian dan Sabuk",
      url: "/admin/ujian",
      items: [
        { title: "Ujian Kenaikan Sabuk", url: "/admin/ujianKenaikanSabuk" },
        {
          title: "Kelola Peserta Ujian",
          url: "/admin/ujianKenaikanSabuk/ujian-terjadwal",
        },
        {
          title: "Restore Ujian",
          url: "/admin/ujianKenaikanSabuk/deleted",
        },
        {
          title: "Riwayat Kenaikan Sabuk",
          url: "/admin/ujianKenaikanSabuk/riwayat",
        },
      ],
    },
    {
      title: "Kejuaraan dan Prestasi",
      url: "/admin/kejuaraan",
      items: [
        { title: "Data Kejuaraan", url: "/admin/kejuaraan" },
        { title: "Kelola Kelas Kyorugi", url: "/admin/kelas-kyorugi" },
        { title: "Kelola Kelas Poomsae", url: "/admin/kelas-poomsae" },
        {
          title: "Kelola Peserta Kejuaraan",
          url: "/admin/kejuaraan/peserta-kejuaraan",
        },
        {
          title: "Tambah Kelas Kejuaraan",
          url: "/admin/kejuaraan/kelola-kelas-kejuaraan",
        },
        {
          title: "Hapus Kelas Kejuaraan",
          url: "/admin/kejuaraan/hapus-kelas-kejuaraan",
        },
        { title: "Rekap Prestasi", url: "/admin/kejuaraan/rekap-kejuaraan" },
      ],
    },
    {
      title: "Pengumuman",
      url: "/admin/pengumuman",
      items: [
        { title: "Kelola Pengumuman", url: "/admin/pengumuman" },
        { title: "Kirim Draft", url: "/admin/pengumuman/draft" },
        { title: "Kelola Grup", url: "/admin/pengumuman/group-whatsapp" },
      ],
    },
    {
      title: "Setting",
      url: "/admin/users",
      items: [{ title: "Manajemen Role dan Akun", url: "/admin/users" }],
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/public/meguri.jpg",
  },
};

// Mapping icon per item URL
const ITEM_ICONS: Record<string, React.ElementType> = {
  "/admin/anggota/murid": IconUsers,
  "/admin/anggota/pelatih": IconSchool,
  "/admin/anggota/admin": IconShieldCheck,
  "/admin/anggota/addUser": IconUserPlus,
  "/admin/jadwal/jadwal": IconCalendar,
  "/admin/libur": IconCalendarOff,
  "/admin/liburGlobal": IconCalendarOff,
  "/admin/jadwal/create": IconCalendar,
  "/admin/kelas": IconUsersGroup,
  "/admin/kelas/addMurid": IconUserPlus,
  "/admin/kelas/addPelatih": IconUserPlus,
  "/admin/ujianKenaikanSabuk": IconCertificate,
  "/admin/ujianKenaikanSabuk/ujian-terjadwal": IconClipboardList,
  "/admin/ujianKenaikanSabuk/deleted": IconHistory,
  "/admin/ujianKenaikanSabuk/riwayat": IconHistory,
  "/admin/kejuaraan": IconTrophy,
  "/admin/kelas-kyorugi": IconAward,
  "/admin/kelas-poomsae": IconAward,
  "/admin/kejuaraan/peserta-kejuaraan": IconUsers,
  "/admin/kejuaraan/kelola-kelas-kejuaraan": IconTrophy,
  "/admin/kejuaraan/hapus-kelas-kejuaraan": IconTrophy,
  "/admin/kejuaraan/rekap-kejuaraan": IconAward,
  "/admin/pengumuman": IconSpeakerphone,
  "/admin/pengumuman/draft": IconBell,
  "/admin/pengumuman/group-whatsapp": IconUsersGroup,
  "/admin/users": IconSettings,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="mb-2">
        <VersionSwitcher navMain={data.navMain} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-1">
        {data.navMain.map((group) => (
          <div key={group.title} className="mb-4">
            {/* Section label */}
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
              {group.title}
            </p>

            {/* Flat menu items */}
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                const Icon = ITEM_ICONS[item.url];

                return (
                  <SidebarMenuItem key={item.url}>
                    <Link
                      href={item.url}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70",
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-primary" />
                      )}

                      {Icon && (
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      )}

                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
