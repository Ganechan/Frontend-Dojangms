// app\admin\anggota\pelatih\[id]\page.tsx
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";
import type {
  CoachDetail,
  CoachDetailApiResponse,
} from "@/types/admin/pelatih";
import { CoachCard } from "@/components/admin/pelatih/pelatih-card";

// ─── fetch di server ──────────────────────────────────────────────────────────

async function getPelatihById(id: string): Promise<CoachDetail> {
  const numericId = parseInt(id, 10);
  if (!Number.isFinite(numericId) || numericId < 1) notFound();

  try {
    const res = await serverFetch<CoachDetailApiResponse>(
      `/api/admin/get/user/pelatih/${numericId}`,
    );
    return res.data;
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect("/login");
      if (err.status === 403) redirect("/admin");
      if (err.status === 404) notFound();
    }
    throw err;
  }
}

// ─── metadata dinamis ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const coach = await getPelatihById(id);
    return {
      title: `${coach.name} | Detail Pelatih`,
      description: `Detail informasi pelatih ${coach.name}`,
    };
  } catch {
    return { title: "Detail Pelatih | Admin Dashboard" };
  }
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await getPelatihById(id);

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
          <div className="max-w-4xl mx-auto w-full px-4 py-8">
            {/* Tombol Kembali */}
            <Link href="/admin/anggota/pelatih">
              <Button variant="ghost" className="gap-2 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Pelatih
              </Button>
            </Link>

            {/* Semua konten ada di CoachCard */}
            <CoachCard coach={coach} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
