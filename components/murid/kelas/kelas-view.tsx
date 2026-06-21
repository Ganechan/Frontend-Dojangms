"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SummaryCards, SummaryCardsSkeleton } from "./summary-cards";
import { KelasFilters, KelasFiltersSkeleton } from "./kelas-filters";
import { KelasCard, KelasCardSkeleton } from "./kelas-card";
import { KelasPagination, KelasPaginationSkeleton } from "./kelas-pagination";
import { KelasEmptyState, KelasErrorState } from "./kelas-states";
import type {
  KelasResponse,
  KelasMeta,
  StatusFilter,
} from "@/types/murid/kelas";

const API_ENDPOINT = "/api/murid/kelas";

// Helper untuk mapping response dari API ke struktur KelasResponse
function mapApiResponse(apiData: any): KelasResponse {
  // apiData = { success, message, summary, pagination, data }
  const summary = apiData.summary || {
    total_kelas: 0,
    aktif: "0",
    nonaktif: "0",
  };
  const pagination = apiData.pagination || {
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
  };
  const data = apiData.data || [];

  const meta: KelasMeta = {
    total: summary.total_kelas || 0,
    totalAktif: parseInt(summary.aktif) || 0,
    totalNonaktif: parseInt(summary.nonaktif) || 0,
    page: pagination.current_page || 1,
    pageSize: pagination.per_page || 10,
    totalPages: pagination.total_page || 1,
  };

  const mappedData = data.map((item: any) => ({
    id: item.id,
    nama: item.nama,
    deskripsi: item.deskripsi,
    status: item.status,
    tanggal_bergabung: item.tanggal_bergabung || item.created_at || "",
    jumlah_jadwal_aktif: item.jumlah_jadwal_aktif || 0,
    jumlah_pelatih: item.jumlah_pelatih || 0,
  }));

  return { data: mappedData, meta };
}

export function KelasSayaView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const [response, setResponse] = useState<KelasResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const abortRef = useRef<AbortController | null>(null);

  const fetchKelas = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setIsError(false);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (status !== "all") params.set("status", status);

    try {
      const res = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const rawData = await res.json();
      if (!rawData.success) {
        throw new Error(rawData.message || "Gagal memuat data");
      }
      const mapped = mapApiResponse(rawData);
      setResponse(mapped);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setIsError(true);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, status]);

  useEffect(() => {
    fetchKelas();
    return () => abortRef.current?.abort();
  }, [fetchKelas]);

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  }, []);

  const meta = response?.meta ?? {
    total: 0,
    totalAktif: 0,
    totalNonaktif: 0,
    page: 1,
    pageSize,
    totalPages: 1,
  };
  const kelasList = useMemo(() => response?.data ?? [], [response]);

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <SummaryCardsSkeleton />
      ) : (
        <SummaryCards
          total={meta.total}
          totalAktif={meta.totalAktif}
          totalNonaktif={meta.totalNonaktif}
        />
      )}

      {isLoading && !response ? (
        <KelasFiltersSkeleton />
      ) : (
        <KelasFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={handleStatusChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {isError ? (
        <KelasErrorState onRetry={fetchKelas} />
      ) : isLoading ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
              <KelasCardSkeleton key={i} />
            ))}
          </div>
          <KelasPaginationSkeleton />
        </>
      ) : kelasList.length === 0 ? (
        <KelasEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {kelasList.map((kelas) => (
              <KelasCard key={kelas.id} kelas={kelas} />
            ))}
          </div>
          <KelasPagination
            page={meta.page}
            pageSize={meta.pageSize}
            total={meta.total}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
