"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  JadwalSummaryCards,
  JadwalSummaryCardsSkeleton,
} from "./jadwal-summary-cards";
import { JadwalFilters, JadwalFiltersSkeleton } from "./jadwal-filters";
import { JadwalCard, JadwalCardSkeleton } from "./jadwal-card";
import {
  JadwalPagination,
  JadwalPaginationSkeleton,
} from "./jadwal-pagination";
import { JadwalEmptyState, JadwalErrorState } from "./jadwal-states";
import type {
  JadwalResponse,
  JadwalMeta,
  HariFilter,
} from "@/types/murid/jadwal";
import type { StatusFilter } from "@/types/murid/kelas";

const API_ENDPOINT = "/api/murid/jadwal";

// Helper untuk memetakan response dari API ke JadwalResponse
function mapApiResponse(apiData: any): JadwalResponse {
  // apiData = { success, message, data, summary, pagination }
  const data = apiData.data || [];
  const summary = apiData.summary || { total_jadwal: 0 };
  const pagination = apiData.pagination || {
    current_page: 1,
    per_page: 10,
    total_page: 1,
    total_data: 0,
  };

  // Mapping Jadwal
  const mappedData = data.map((item: any) => ({
    id: item.id,
    nama: item.jadwal_nama,
    kelasNama: item.kelas_nama || "",
    status: item.kelas_status || item.status || "aktif",
    progress: item.status_jadwal || "berlangsung",
    hari: item.hari,
    jamMulai: item.jam_mulai,
    jamSelesai: item.jam_selesai,
    lokasi: item.lokasi,
    berlakuMulai: item.effective_from || "",
    berlakuSampai: item.effective_until || null,
    tipeJadwal: item.tipe || "kelas",
  }));

  // Menghitung totalAktif dan totalHariIni dari data
  const totalAktif = mappedData.filter((j: any) => j.status === "aktif").length;
  const now = new Date();
  const today = now
    .toLocaleDateString("id-ID", { weekday: "long" })
    .toLowerCase();
  const totalHariIni = mappedData.filter((j: any) => j.hari === today).length;

  const meta: JadwalMeta = {
    total: pagination.total_data || summary.total_jadwal || 0,
    totalAktif,
    totalHariIni,
    page: pagination.current_page || 1,
    pageSize: pagination.per_page || 10,
    totalPages: pagination.total_page || 1,
  };

  return { data: mappedData, meta };
}

export function JadwalSayaView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [hari, setHari] = useState<HariFilter>("all");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const [response, setResponse] = useState<JadwalResponse | null>(null);
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

  const fetchJadwal = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setIsError(false);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (status !== "all") params.set("status", status);
    if (hari !== "all") params.set("hari", hari);

    try {
      const res = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `Request failed with status ${res.status}`,
        );
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Gagal memuat data");
      }
      const mapped = mapApiResponse(json);
      setResponse(mapped);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setIsError(true);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, status, hari]);

  useEffect(() => {
    fetchJadwal();
    return () => abortRef.current?.abort();
  }, [fetchJadwal]);

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleHariChange = useCallback((value: HariFilter) => {
    setHari(value);
    setPage(1);
  }, []);

  const meta = response?.meta ?? {
    total: 0,
    totalAktif: 0,
    totalHariIni: 0,
    page: 1,
    pageSize,
    totalPages: 1,
  };
  const jadwalList = useMemo(() => response?.data ?? [], [response]);

  return (
    <div className="flex flex-col gap-6">
      {isLoading && !response ? (
        <JadwalSummaryCardsSkeleton />
      ) : (
        <JadwalSummaryCards
          total={meta.total}
          totalAktif={meta.totalAktif}
          totalHariIni={meta.totalHariIni}
        />
      )}

      <div className="sticky top-0 z-10 -mx-4 bg-background/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:rounded-xl">
        {isLoading && !response ? (
          <JadwalFiltersSkeleton />
        ) : (
          <JadwalFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={handleStatusChange}
            hari={hari}
            onHariChange={handleHariChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {isError ? (
        <JadwalErrorState onRetry={fetchJadwal} />
      ) : isLoading ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
              <JadwalCardSkeleton key={i} />
            ))}
          </div>
          <JadwalPaginationSkeleton />
        </>
      ) : jadwalList.length === 0 ? (
        <JadwalEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {jadwalList.map((jadwal) => (
              <JadwalCard key={jadwal.id} jadwal={jadwal} />
            ))}
          </div>
          <JadwalPagination
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
