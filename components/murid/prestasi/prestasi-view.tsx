// components\murid\prestasi\prestasi-view.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { StatistikCards, StatistikCardsSkeleton } from "./statistik-cards";
import { PrestasiFilters, PrestasiFiltersSkeleton } from "./prestasi-filters";
import { PrestasiCard, PrestasiCardSkeleton } from "./prestasi-card";
import { PrestasiPagination } from "./prestasi-pagination";
import {
  PrestasiEmptyState,
  PrestasiErrorState,
  PrestasiSearchEmptyState,
} from "./prestasi-states";
import {
  fetchPrestasi,
  fetchStatistik,
  type PrestasiPage,
  type PrestasiStatistik,
} from "@/types/murid/prestasi";

const DEFAULT_PER_PAGE = 10;

export function PrestasiView() {
  // Statistics state
  const [statistik, setStatistik] = useState<PrestasiStatistik | null>(null);
  const [statistikLoading, setStatistikLoading] = useState(true);
  const [statistikError, setStatistikError] = useState(false);

  // History list state
  const [result, setResult] = useState<PrestasiPage | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tahun, setTahun] = useState("all");
  const [level, setLevel] = useState("all");
  const [hasil, setHasil] = useState("all");
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [page, setPage] = useState(1);

  const [statistikReloadKey, setStatistikReloadKey] = useState(0);
  const [listReloadKey, setListReloadKey] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);

  // Debounce the search input.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to first page whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tahun, level, hasil, perPage]);

  // Load statistics.
  useEffect(() => {
    const controller = new AbortController();
    setStatistikLoading(true);
    setStatistikError(false);
    fetchStatistik(controller.signal)
      .then((data) => setStatistik(data))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.log("[v0] statistik error:", error);
        setStatistikError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setStatistikLoading(false);
      });
    return () => controller.abort();
  }, [statistikReloadKey]);

  // Load paginated history.
  useEffect(() => {
    const controller = new AbortController();
    setListLoading(true);
    setListError(false);
    fetchPrestasi(
      { search: debouncedSearch, tahun, level, hasil, perPage, page },
      controller.signal,
    )
      .then((data) => setResult(data))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.log("[v0] prestasi error:", error);
        setListError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setListLoading(false);
      });
    return () => controller.abort();
  }, [debouncedSearch, tahun, level, hasil, perPage, page, listReloadKey]);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const hasActiveFilters =
    debouncedSearch.trim() !== "" ||
    tahun !== "all" ||
    level !== "all" ||
    hasil !== "all";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Riwayat Kejuaraan
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Lihat seluruh kejuaraan dan prestasi yang pernah Anda ikuti.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-6">
        {/* Statistics */}
        {statistikLoading ? (
          <StatistikCardsSkeleton />
        ) : statistikError || !statistik ? (
          <PrestasiErrorState
            onRetry={() => setStatistikReloadKey((k) => k + 1)}
          />
        ) : (
          <StatistikCards data={statistik} />
        )}

        {/* Filters */}
        {listLoading && !result ? (
          <PrestasiFiltersSkeleton />
        ) : (
          <PrestasiFilters
            search={search}
            tahun={tahun}
            level={level}
            hasil={hasil}
            perPage={perPage}
            onSearchChange={setSearch}
            onTahunChange={setTahun}
            onLevelChange={setLevel}
            onHasilChange={setHasil}
            onPerPageChange={setPerPage}
          />
        )}

        {/* History list */}
        <div ref={listRef} className="scroll-mt-6">
          {listError ? (
            <PrestasiErrorState
              onRetry={() => setListReloadKey((k) => k + 1)}
            />
          ) : listLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: Math.min(perPage, 4) }).map((_, i) => (
                <PrestasiCardSkeleton key={i} />
              ))}
            </div>
          ) : !result || result.data.length === 0 ? (
            hasActiveFilters ? (
              <PrestasiSearchEmptyState />
            ) : (
              <PrestasiEmptyState />
            )
          ) : (
            <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {result.data.map((prestasi, index) => (
                <li key={`${prestasi.kejuaraan_id}-${index}`}>
                  <PrestasiCard prestasi={prestasi} />
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Pagination */}
        {!listError && !listLoading && result && result.data.length > 0 && (
          <PrestasiPagination
            page={result.page}
            lastPage={result.lastPage}
            total={result.total}
            perPage={result.perPage}
            itemCount={result.data.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}
