// app/admin/anggota/admin/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";
import type { AdminDetail, AdminDetailApiResponse } from "@/types/admin/admin";
import { AdminEditForm } from "@/components/admin/admin/admin-edit-form";

// ── fetch di server ───────────────────────────────────────────────────────────

async function getAdminById(id: string): Promise<AdminDetail> {
  const numericId = parseInt(id, 10);
  if (!Number.isFinite(numericId) || numericId < 1) notFound();

  try {
    const res = await serverFetch<AdminDetailApiResponse>(
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
    const admin = await getAdminById(id);
    return {
      title: `Edit ${admin.name} | Admin Dashboard`,
      description: `Edit data admin ${admin.name}`,
    };
  } catch {
    return { title: "Edit Admin | Admin Dashboard" };
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = await getAdminById(id);

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
              <Link href={`/admin/anggota/admin/${id}`}>
                <Button variant="ghost" className="gap-2 -ml-3 mb-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Detail Admin
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold tracking-tight">
                Edit Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Perbarui data admin{" "}
                <span className="font-medium text-foreground">{admin.name}</span>
              </p>
            </div>

            {/* ── Form ── */}
            <AdminEditForm admin={admin} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}