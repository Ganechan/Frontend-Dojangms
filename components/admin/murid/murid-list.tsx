// components\admin\murid\murid-list.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/apiClient";
import {
  fetchMurid,
  sanitizeLimit,
  sanitizePage,
} from "@/services/admin/muridService";
import type {
  ActiveStatusTab,
  MuridApiResponse,
  MuridStatus,
  MuridStatusCounts,
  FetchMuridParams,
} from "@/types/admin/murid";
import { MuridDataTable } from "./murid-table";

export function MuridList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apiResponse, setApiResponse] = React.useState<MuridApiResponse | null>(
    null,
  );
  const [statusCounts, setStatusCounts] = React.useState<
    MuridStatusCounts | undefined
  >(undefined);
  const [loading, setLoading] = React.useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0); // untuk trigger refresh data

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
        const params: FetchMuridParams = {
          page: currentPage,
          limit: pageSize,
          search: search || undefined,
          status: status !== "total" ? (status as MuridStatus) : undefined,
        };

        const data = await fetchMurid(params);

        if (!cancelled) {
          setApiResponse(data);

          // summary dari API sudah berisi total keseluruhan — langsung akurat
          setStatusCounts({
            total: data.summary.total_murid,
            active: Number(data.summary.total_murid_active),
            inactive: Number(data.summary.total_murid_inactive),
            suspended: 0,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);

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
              case 404:
                toast.error("Data tidak ditemukan");
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
          <p className="text-muted-foreground">Memuat data murid...</p>
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
    <MuridDataTable
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
      onRefresh={() => setRefreshKey((k) => k + 1)} // trigger refresh data
    />
  );
}
