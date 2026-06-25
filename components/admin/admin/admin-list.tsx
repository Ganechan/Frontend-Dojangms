// components/admin/admin/admin-list.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/apiClient";
import {
  fetchAdmin,
  sanitizeLimit,
  sanitizePage,
} from "@/services/admin/adminService";
import type {
  ActiveStatusTab,
  AdminApiResponse,
  AdminStatus,
  AdminStatusCounts,
  FetchAdminParams,
} from "@/types/admin/admin";
import { AdminDataTable } from "./admin-table";

export function AdminList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apiResponse, setApiResponse] = React.useState<AdminApiResponse | null>(
    null,
  );
  const [statusCounts, setStatusCounts] = React.useState<
    AdminStatusCounts | undefined
  >(undefined);
  const [loading, setLoading] = React.useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const currentPage = sanitizePage(searchParams.get("page"));
  const pageSize = sanitizeLimit(searchParams.get("limit"));
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "total") as ActiveStatusTab;

  const updateURL = React.useCallback(
    (
      params: Partial<Record<"page" | "limit" | "search" | "status", string>>,
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== "total") next.set(k, v);
        else next.delete(k);
      });
      router.push(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params: FetchAdminParams = {
          page: currentPage,
          limit: pageSize,
          search: search || undefined,
          status: status !== "total" ? (status as AdminStatus) : undefined,
        };

        const data = await fetchAdmin(params);

        if (!cancelled) {
          setApiResponse(data);
          setStatusCounts({
            total: data.summary.total_admin,
            active: Number(data.summary.total_admin_active),
            inactive: Number(data.summary.total_admin_inactive),
          });
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError) {
            switch (err.status) {
              case 401:
                toast.error("Sesi habis, silakan login kembali");
                router.push("/login");
                break;
              case 403:
                toast.error("Anda tidak memiliki akses ke halaman ini");
                router.push("/admin");
                break;
              default:
                toast.error("Terjadi kesalahan server");
            }
          } else {
            toast.error("Gagal terhubung ke server");
          }
          setApiResponse(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage, pageSize, search, status, refreshKey]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Memuat data admin...</p>
        </div>
      </div>
    );
  }

  if (!apiResponse) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          Gagal memuat data. Coba refresh halaman.
        </p>
      </div>
    );
  }

  return (
    <AdminDataTable
      data={apiResponse.data}
      pagination={apiResponse.pagination}
      statusCounts={statusCounts}
      initialSearch={search}
      initialStatus={status}
      onPageChange={(page) => updateURL({ page: String(page) })}
      onPageSizeChange={(limit) =>
        updateURL({ limit: String(limit), page: "1" })
      }
      onSearchChange={(q) => updateURL({ search: q, page: "1" })}
      onStatusChange={(s) => updateURL({ status: s, page: "1" })}
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  );
}
