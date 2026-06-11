// components/admin/site-header.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Map segment URL → label yang readable
const PATH_LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/anggota": "Manajemen Anggota",
  "/admin/anggota/murid": "Data Murid",
  "/admin/anggota/pelatih": "Data Pelatih",
  "/admin/anggota/admin": "Data Admin",       // ← tidak konflik lagi
  "/admin/anggota/addUser": "Buat Data User Baru",
  "/admin/jadwal": "Kelas dan Jadwal Latihan",
  "/admin/jadwal/jadwal": "Jadwal Latihan",
  "/admin/jadwal/create": "Buat Jadwal",
  "/admin/jadwal/materi": "Materi Latihan",
  "/admin/ujian": "Ujian dan Sabuk",
  "/admin/ujian/jadwal": "Jadwal Ujian",
  "/admin/ujian/riwayat": "Riwayat Kenaikan Sabuk",
  "/admin/kejuaraan": "Kejuaraan dan Prestasi",
  "/admin/kejuaraan/data": "Data Kejuaraan",   // ← tidak konflik lagi
  "/admin/kejuaraan/rekap": "Rekap Prestasi",
  "/admin/setting": "Setting",
  "/admin/setting/akun": "Manajemen Role dan Akun",
  "/admin/setting/sabuk": "Tingkatan Sabuk",
  "/admin/setting/backup": "BackUp Data",
};

function getLabel(fullPath: string, segment: string): string {
  return (
    PATH_LABELS[fullPath] ??
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  // Pisah path jadi segments, buang yang kosong
  // contoh: /admin/anggota/murid → ["admin", "anggota", "murid"]
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, index) => {
    const fullPath = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: getLabel(fullPath, seg),  // ← pakai fullPath, bukan seg saja
      href: fullPath,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.href}>
                {crumb.isLast ? (
                  // Segment terakhir → tidak bisa diklik (halaman aktif)
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                    {index < crumbs.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}