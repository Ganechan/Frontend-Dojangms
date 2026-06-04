// app/admin/anggota/pelatih/[id]/edit/page.tsx
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
import { PelatihEditForm } from "@/components/admin/pelatih/pelatih-edit-from";

// ── fetch di server ───────────────────────────────────────────────────────────

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

// ── metadata dinamis ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const pelatih = await getPelatihById(id);
    return {
      title: `Edit ${pelatih.name} | Admin Dashboard`,
      description: `Edit data pelatih ${pelatih.name}`,
    };
  } catch {
    return { title: "Edit Pelatih | Admin Dashboard" };
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function PelatihEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pelatih = await getPelatihById(id);

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
            {/* ── Header ── */}
            <div className="flex flex-col gap-1 mb-6">
              <Link href={`/admin/anggota/pelatih`}>
                <Button variant="ghost" className="gap-2 -ml-3 mb-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Detail Pelatih
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold tracking-tight">
                Edit Pelatih
              </h1>
              <p className="text-sm text-muted-foreground">
                Perbarui data pelatih{" "}
                <span className="font-medium text-foreground">
                  {pelatih.name}
                </span>
              </p>
            </div>

            {/* ── Form ── */}
            <PelatihEditForm pelatih={pelatih} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
