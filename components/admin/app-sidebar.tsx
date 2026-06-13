"use client";

import * as React from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { VersionSwitcher } from "@/components/admin/version-switcher";

const data = {
  navMain: [
    {
      title: "Manajemen Anggota",
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
    // {
    //   title: "Ujian dan Sabuk",
    //   url: "/admin/ujian",
    //   items: [
    //     { title: "Jadwal Ujian", url: "/admin/ujian/jadwal" },
    //     { title: "Riwayat Kenaikan Sabuk", url: "/admin/ujian/riwayat" },
    //   ],
    // },
    // {
    //   title: "Kejuaraan dan Prestasi",
    //   url: "/admin/kejuaraan",
    //   items: [
    //     { title: "Data Kejuaraan", url: "/admin/kejuaraan/data" },
    //     { title: "Rekap Prestasi", url: "/admin/kejuaraan/rekap" },
    //   ],
    // },
    // {
    //   title: "Keuangan",
    //   url: "/admin/keuangan",
    //   items: [
    //     { title: "Pembayaran SPP", url: "/admin/keuangan/spp" },
    //     { title: "Biaya Pendaftaran", url: "/admin/keuangan/pendaftaran" },
    //     { title: "Laporan Keuangan", url: "/admin/keuangan/laporan" },
    //     { title: "Tunggakan", url: "/admin/keuangan/tunggakan" },
    //   ],
    // },
    // {
    //   title: "Laporan",
    //   url: "/admin/laporan",
    //   items: [
    //     { title: "Laporan Absensi", url: "/admin/laporan/absensi" },
    //     { title: "Laporan Keuangan", url: "/admin/laporan/keuangan" },
    //     { title: "Export Data", url: "/admin/laporan/export" },
    //   ],
    // },
    // {
    //   title: "Setting",
    //   url: "/admin/setting",
    //   items: [
    //     { title: "Manajemen Role dan Akun", url: "/admin/setting/akun" },
    //     { title: "Tingkatan Sabuk", url: "/admin/setting/sabuk" },
    //     { title: "BackUp Data", url: "/admin/setting/backup" },
    //   ],
    // },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/public/meguri.jpg",
  },
};

const STORAGE_KEY = "admin-sidebar-open-groups";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Simpan daftar group title yang sedang open
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(new Set());

  // 1) Saat mount: load dari localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setOpenGroups(new Set(parsed.filter((x) => typeof x === "string")));
      }
    } catch {
      // ignore
    }
  }, []);

  // 2) Kalau route aktif ada di salah satu group, pastikan group itu terbuka juga
  //    (biar kalau user refresh di halaman /admin/keuangan/spp, group Keuangan tetap open)
  React.useEffect(() => {
    const activeGroupTitles = data.navMain
      .filter((group) =>
        group.items?.some((item) => pathname.startsWith(item.url)),
      )
      .map((g) => g.title);

    if (activeGroupTitles.length === 0) return;

    setOpenGroups((prev) => {
      const next = new Set(prev);
      activeGroupTitles.forEach((t) => next.add(t));
      return next;
    });
  }, [pathname]);

  // 3) Persist ke localStorage setiap berubah
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(openGroups)));
    } catch {
      // ignore
    }
  }, [openGroups]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="mb-5">
        <VersionSwitcher navMain={data.navMain} />
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {data.navMain.map((group) => {
          const isOpen = openGroups.has(group.title);

          return (
            <Collapsible
              key={group.title}
              open={isOpen}
              onOpenChange={(nextOpen) => {
                setOpenGroups((prev) => {
                  const next = new Set(prev);
                  if (nextOpen) next.add(group.title);
                  else next.delete(group.title);
                  return next;
                });
              }}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {group.title}
                    <IconChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const isActive =
                          pathname === item.url ||
                          pathname.startsWith(item.url + "/");

                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className={
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : ""
                              }
                            >
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
