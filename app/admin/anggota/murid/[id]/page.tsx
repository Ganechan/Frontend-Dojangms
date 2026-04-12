// app/admin/anggota/murid/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";
import type { MuridDetail, MuridDetailApiResponse } from "@/types/admin/murid";
import { MuridCard } from "@/components/admin/murid/murid-card";

// ── fetch di server ───────────────────────────────────────────────────────────

async function getMuridById(id: string): Promise<MuridDetail> {
  const numericId = parseInt(id, 10);
  if (!Number.isFinite(numericId) || numericId < 1) notFound();

  try {
    const res = await serverFetch<MuridDetailApiResponse>(
      `/api/admin/get/user/${numericId}`,
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
    const murid = await getMuridById(id);
    return {
      title: `${murid.name} | Detail Murid`,
      description: `Detail informasi murid ${murid.name}`,
    };
  } catch {
    return { title: "Detail Murid | Admin Dashboard" };
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function MuridDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const murid = await getMuridById(id);

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
            <Link href="/admin/anggota/murid">
              <Button variant="ghost" className="gap-2 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Murid
              </Button>
            </Link>

            <MuridCard murid={murid} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
