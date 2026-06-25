import type { Metadata } from "next";
import { JadwalSayaView } from "@/components/murid/jadwal/jadwal-view";
import { AppSidebar } from "@/components/murid/app-sidebar";
import { SiteHeader } from "@/components/murid/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Jadwal Saya | Portal Siswa Taekwondo",
  description: "Lihat seluruh jadwal latihan yang terdaftar pada kelas Anda.",
};

export default function JadwalSayaPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <header className="mb-8 flex flex-col gap-1.5">
                  <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                    Jadwal Saya
                  </h1>
                  <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                    Lihat seluruh jadwal latihan yang terdaftar pada kelas Anda.
                  </p>
                </header>

                <JadwalSayaView />
              </main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
