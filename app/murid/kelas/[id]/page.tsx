import type { Metadata } from "next";
import { KelasDetailView } from "@/components/murid/kelas-detail/kelas-detail-view";
import { AppSidebar } from "@/components/murid/app-sidebar";
import { SiteHeader } from "@/components/murid/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Detail Kelas Saya | Portal Siswa Taekwondo",
  description:
    "Lihat detail kelas, jadwal latihan, statistik, dan riwayat absensi Anda.",
};

export default async function DetailKelasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
              <main className="min-h-screen bg-background">
                <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                  <KelasDetailView kelasId={id} />
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
