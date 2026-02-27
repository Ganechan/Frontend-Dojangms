// app/admin/kejuaraan/page.tsx
export const dynamic = "force-dynamic";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChampionshipDashboardClient } from "@/components/admin/kejuaraan/championship-dashboard-client";

export default function ChampionshipPage() {
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
              <ChampionshipDashboardClient />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
