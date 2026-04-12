// components\admin\pelatih\pelatih-list.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/apiClient";
import {
  fetchPelatih,
  sanitizeLimit,
  sanitizePage,
} from "@/services/admin/pelatihService";
import type {
  ActiveStatusTab,
  CoachApiResponse,
  CoachStatus,
  CoachStatusCounts,
  FetchCoachesParams,
} from "@/types/admin/pelatih";
import { CoachDataTable } from "./pelatih-table";
import { PelatihTableSkeleton } from "./pelatih-table-skeleton";

export function CoachList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apiResponse, setApiResponse] = React.useState<CoachApiResponse | null>(
    null,
  );
  const [statusCounts, setStatusCounts] = React.useState<
    CoachStatusCounts | undefined
  >(undefined);

  // ── 2 state loading yang berbeda ─────────────────────────────────────────
  const [isFirstLoad, setIsFirstLoad] = React.useState(true); // ← skeleton
  const [isFetching, setIsFetching] = React.useState(false); // ← spinner overlay

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
      // kalau sudah pernah load → pakai spinner, bukan skeleton
      if (isFirstLoad) {
        // skeleton sudah aktif dari useState(true), tidak perlu set lagi
      } else {
        setIsFetching(true);
      }

      try {
        const params: FetchCoachesParams = {
          page: currentPage,
          limit: pageSize,
          search: search || undefined,
          status: status !== "total" ? (status as CoachStatus) : undefined,
        };

        const data = await fetchPelatih(params);

        if (!cancelled) {
          setApiResponse(data);

          setStatusCounts((prev) => {
            const next: CoachStatusCounts = {
              total: prev?.total ?? 0,
              active: prev?.active ?? 0,
              inactive: prev?.inactive ?? 0,
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
        if (!cancelled) {
          setIsFirstLoad(false); // ← setelah load pertama selesai, skeleton tidak muncul lagi
          setIsFetching(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage, pageSize, search, status]);

  // ── first load → tampilkan skeleton ──────────────────────────────────────
  if (isFirstLoad) {
    return <PelatihTableSkeleton />;
  }

  // ── gagal load & tidak ada data sama sekali ───────────────────────────────
  if (!apiResponse) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          Gagal memuat data. Coba refresh halaman.
        </p>
      </div>
    );
  }

  // ── normal render dengan spinner overlay saat re-fetch ───────────────────
  return (
    <div className="relative">
      {/* Spinner overlay — muncul saat ganti halaman/filter/search */}
      {isFetching && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Memuat...</p>
          </div>
        </div>
      )}

      <CoachDataTable
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
      />
    </div>
  );
}
