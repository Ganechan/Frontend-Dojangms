// app/admin/kejuaraan/edit/[id]/page.tsx
export const dynamic = "force-dynamic";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChampionshipForm } from "@/components/admin/kejuaraan/championship-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getChampionship(id: string) {
  const response = await fetch(
    `http://localhost:3001/api/admin/get/championship/${id}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;
  const result = await response.json();
  return result.data || null;
}

export default async function EditChampionshipPage({ params }: PageProps) {
  const { id } = await params;
  const championship = await getChampionship(id);

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
              <ChampionshipForm initialData={championship} isEditMode={true} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
