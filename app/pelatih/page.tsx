import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPelatihPage() {
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
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard Pelatih
                  </h1>
                  <p className="text-muted-foreground">
                    Kelola data murid, jadwal latihan, dan aktivitas
                    kepelatihan.
                  </p>
                </div>

                {/* Welcome Card */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-xl font-semibold">
                    Selamat Datang di Dashboard Pelatih
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Gunakan menu di samping untuk mengelola murid, memantau
                    perkembangan latihan, melihat jadwal, serta mengakses fitur
                    kepelatihan lainnya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
