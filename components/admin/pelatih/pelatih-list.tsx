"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/apiClient";
import { fetchPelatih, sanitizeLimit, sanitizePage } from "@/services/pelatihService";
import type {
  ActiveStatusTab,
  CoachApiResponse,
  CoachStatus,
  CoachStatusCounts,
  FetchCoachesParams,
} from "@/types/pelatih";
import { CoachDataTable } from "./pelatih-table";

export function CoachList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apiResponse, setApiResponse]   = React.useState<CoachApiResponse | null>(null);
  const [statusCounts, setStatusCounts] = React.useState<CoachStatusCounts | undefined>(undefined);
  const [loading, setLoading]           = React.useState(true);

  const currentPage = sanitizePage(searchParams.get("page"));
  const pageSize    = sanitizeLimit(searchParams.get("limit"));
  const search      = searchParams.get("search") ?? "";
  const status      = (searchParams.get("status") ?? "total") as ActiveStatusTab;

  const updateURL = React.useCallback(
    (params: Partial<Record<"page" | "limit" | "search" | "status", string>>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== "total") next.set(k, v);
        else next.delete(k);
      });
      router.push(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params: FetchCoachesParams = {
          page:   currentPage,
          limit:  pageSize,
          search: search || undefined,
          status: status !== "total" ? (status as CoachStatus) : undefined,
        };

        const data = await fetchPelatih(params);

        if (!cancelled) {
          setApiResponse(data);

          setStatusCounts((prev) => {
            const next: CoachStatusCounts = {
              total:     prev?.total     ?? 0,
              active:    prev?.active    ?? 0,
              inactive:  prev?.inactive  ?? 0,
            };

            if (status === "total") {
              next.total = data.pagination.total_data;
            } else {
              next[status as CoachStatus] = data.pagination.total_data;
            }

            return next;
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
                router.push("/admin"); // redirect ke halaman default admin
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
    return () => { cancelled = true; };
  }, [currentPage, pageSize, search, status]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Memuat data pelatih...</p>
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
    <CoachDataTable
      data={apiResponse.data}
      pagination={apiResponse.pagination}
      statusCounts={statusCounts}
      initialSearch={search}
      initialStatus={status}
      onPageChange={(page) => updateURL({ page: String(page) })}
      onPageSizeChange={(limit) => updateURL({ limit: String(limit), page: "1" })}
      onSearchChange={(q) => updateURL({ search: q, page: "1" })}
      onStatusChange={(s) => updateURL({ status: s, page: "1" })}
    />
  );
}