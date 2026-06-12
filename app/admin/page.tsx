// app\admin\page.tsx
export const dynamic = "force-dynamic";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/admin/data-table";
import { SectionPieChartsServer } from "@/components/server/admin/section-pie-charts-server";
import { SectionCardsServer } from "@/components/server/admin/section-cards-server";
import { ChartAreaInteractiveServer } from "@/components/server/admin/chart-area-interactive-server";

import data from "./data.json";

export default function Page() {
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
              <SectionCardsServer />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractiveServer />
              </div>
              <SectionPieChartsServer />
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
