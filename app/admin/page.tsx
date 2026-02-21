import { AppSidebar } from "@/components/admin/app-sidebar";
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive";
import { DataTable } from "@/components/admin/data-table";
import { SectionCards } from "@/components/admin/section-cards";
import { SiteHeader } from "@/components/admin/site-header";
import { SectionPieCharts } from "@/components/admin/pie-chart";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

const BASE_URL = process.env.BASE_URL;

async function getDashboardData() {
  try {
    const [userRes, beltRes, statRes, championship5yRes, championship3mRes] =
      await Promise.all([
        fetch(`${BASE_URL}/api/admin/get/user/all`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/championship`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/user/stats`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/championship/5years`, {
          next: { revalidate: 60 },
        }),
        fetch(`${BASE_URL}/api/admin/get/championship/3months`, {
          next: { revalidate: 60 },
        }),
      ]);

    const [
      userJson,
      beltJson,
      statsJson,
      championship5yJson,
      championship3mJson,
    ] = await Promise.all([
      userRes.json().catch(() => null),
      beltRes.json().catch(() => null),
      statRes.json().catch(() => null),
      championship5yRes.json().catch(() => null),
      championship3mRes.json().catch(() => null),
    ]);

    return {
      userJson,
      beltJson,
      statsJson,
      championship5yJson,
      championship3mJson,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export default async function Page() {
  const dashboardData = await getDashboardData();

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
              <SectionCards data={dashboardData} /> {/* ← pass data */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <SectionPieCharts />
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
