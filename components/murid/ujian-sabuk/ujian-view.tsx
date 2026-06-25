"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BeltHero, BeltHeroSkeleton } from "./belt-hero";
import {
  StatistikUjian,
  StatistikUjianSkeleton,
} from "./statistik-ujian";
import {
  BeltTimeline,
  BeltTimelineSkeleton,
} from "./belt-timeline";
import {
  UjianFilters,
  UjianFiltersSkeleton,
} from "./ujian-filter";
import { UjianCard, UjianCardSkeleton } from "./ujian-card";
import { UjianPagination } from "./ujian-pagination";
import {
  UjianEmptyState,
  UjianErrorState,
  UjianSearchEmptyState,
} from "./ujian-states";
import {
  fetchSabukTimeline,
  fetchStatistik,
  fetchUjian,
  type BeltTimelineResult,
  type UjianPage,
  type UjianStatistik,
} from "@/types/murid/ujian-sabuk";

const DEFAULT_PER_PAGE = 10;

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-balance">
        {title}
      </h2>
      <p className="text-sm text-pretty text-muted-foreground">{description}</p>
    </div>
  );
}

export function UjianView() {
  // Statistics
  const [statistik, setStatistik] = useState<UjianStatistik | null>(null);
  const [statistikLoading, setStatistikLoading] = useState(true);
  const [statistikError, setStatistikError] = useState(false);
  const [statistikReloadKey, setStatistikReloadKey] = useState(0);

  // Belt timeline + current belt
  const [belt, setBelt] = useState<BeltTimelineResult | null>(null);
  const [beltLoading, setBeltLoading] = useState(true);
  const [beltError, setBeltError] = useState(false);
  const [beltReloadKey, setBeltReloadKey] = useState(0);

  // Exam history list
  const [result, setResult] = useState<UjianPage | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const [listReloadKey, setListReloadKey] = useState(0);

  // Filters
  const [status, setStatus] = useState("all");
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [page, setPage] = useState(1);

  const listRef = useRef<HTMLDivElement>(null);

  // Reset to first page when a filter changes.
  useEffect(() => {
    setPage(1);
  }, [status, perPage]);

  // Load statistics.
  useEffect(() => {
    const controller = new AbortController();
    setStatistikLoading(true);
    setStatistikError(false);
    fetchStatistik(controller.signal)
      .then(setStatistik)
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

  // Load belt timeline.
  useEffect(() => {
    const controller = new AbortController();
    setBeltLoading(true);
    setBeltError(false);
    fetchSabukTimeline(controller.signal)
      .then(setBelt)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.log("[v0] belt timeline error:", error);
        setBeltError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setBeltLoading(false);
      });
    return () => controller.abort();
  }, [beltReloadKey]);

  // Load paginated exam history.
  useEffect(() => {
    const controller = new AbortController();
    setListLoading(true);
    setListError(false);
    fetchUjian({ status, perPage, page }, controller.signal)
      .then(setResult)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.log("[v0] ujian error:", error);
        setListError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setListLoading(false);
      });
    return () => controller.abort();
  }, [status, perPage, page, listReloadKey]);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const hasActiveFilters = status !== "all";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Riwayat Ujian Sabuk
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Lihat perjalanan kenaikan tingkat dan riwayat ujian sabuk Anda.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-10">
        {/* Current belt hero */}
        {beltLoading ? (
          <BeltHeroSkeleton />
        ) : beltError ? (
          <UjianErrorState onRetry={() => setBeltReloadKey((k) => k + 1)} />
        ) : belt?.current ? (
          <BeltHero belt={belt.current} />
        ) : null}

        {/* Statistics */}
        {statistikLoading ? (
          <StatistikUjianSkeleton />
        ) : statistikError || !statistik ? (
          <UjianErrorState
            onRetry={() => setStatistikReloadKey((k) => k + 1)}
          />
        ) : (
          <StatistikUjian data={statistik} />
        )}

        {/* Belt timeline */}
        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Linimasa Sabuk"
            description="Perjalanan perkembangan sabuk yang telah dicapai."
          />
          {beltLoading ? (
            <BeltTimelineSkeleton />
          ) : beltError ? (
            <UjianErrorState onRetry={() => setBeltReloadKey((k) => k + 1)} />
          ) : (
            <BeltTimeline items={belt?.timeline ?? []} />
          )}
        </section>

        {/* Exam history */}
        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Riwayat Ujian"
            description="Daftar seluruh ujian kenaikan tingkat yang pernah diikuti."
          />

          {listLoading && !result ? (
            <UjianFiltersSkeleton />
          ) : (
            <UjianFilters
              status={status}
              perPage={perPage}
              onStatusChange={setStatus}
              onPerPageChange={setPerPage}
            />
          )}

          <div ref={listRef} className="scroll-mt-6">
            {listError ? (
              <UjianErrorState onRetry={() => setListReloadKey((k) => k + 1)} />
            ) : listLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: Math.min(perPage, 4) }).map((_, i) => (
                  <UjianCardSkeleton key={i} />
                ))}
              </div>
            ) : !result || result.data.length === 0 ? (
              hasActiveFilters ? (
                <UjianSearchEmptyState />
              ) : (
                <UjianEmptyState />
              )
            ) : (
              <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {result.data.map((ujian) => (
                  <li key={ujian.id}>
                    <UjianCard ujian={ujian} />
                  </li>
                ))}
              </ol>
            )}
          </div>

          {!listError && !listLoading && result && result.data.length > 0 && (
            <UjianPagination
              page={result.page}
              lastPage={result.lastPage}
              total={result.total}
              perPage={result.perPage}
              itemCount={result.data.length}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>
    </main>
  );
}
