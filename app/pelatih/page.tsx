// app\pelatih\page.tsx
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PelatihTableSkeleton } from "@/components/admin/pelatih/pelatih-table-skeleton";

// CoachList di-lazy load — JS nya baru di-download saat halaman dibuka
// selama download, tampilkan skeleton
const CoachList = dynamic(
  () => import("@/components/admin/pelatih/pelatih-list").then((m) => m.CoachList),
  {
    loading: () => <PelatihTableSkeleton />,
    ssr: false, // CoachList pakai useSearchParams — tidak perlu di-render di server
  }
);

export const metadata = {
  title: "Daftar Pelatih | Admin Dashboard",
  description: "Lihat daftar semua pelatih yang tersedia di akademi",
};

export default function CoachesPage() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <CoachList />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}