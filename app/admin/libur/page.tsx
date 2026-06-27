"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HolidayToolbar } from "@/components/admin/libur/holiday-toolbar";
import { HolidayTable } from "@/components/admin/libur/holiday-table";
import { HolidayPagination } from "@/components/admin/libur/holiday-pagination";
import type {
  HolidayApiResponse,
  HolidaySchedule,
  HolidayPaginationMeta,
} from "@/types/admin/libur";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// IMPORT MODAL
import { AddHolidayModal } from "@/components/admin/libur/add-modal-popup";

export default function HolidaySchedulePage() {
  const [data, setData] = useState<HolidaySchedule[]>([]);
  const [meta, setMeta] = useState<HolidayPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    tanggal_start: "",
    tanggal_end: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchHolidays = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (filters.tanggal_start) {
        params.append("tanggal_start", filters.tanggal_start);
      }
      if (filters.tanggal_end) {
        params.append("tanggal_end", filters.tanggal_end);
      }

      const response = await fetch(
        `/api/admin/jadwal/libur/all?${params.toString()}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch holidays");
      }

      const result: HolidayApiResponse = await response.json();
      setData(result.data);
      setMeta(result.pagination);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data libur jadwal",
      );
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [page, limit, filters]);

  const handleFilterChange = (newFilters: {
    tanggal_start: string;
    tanggal_end: string;
  }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="mx-auto max-w-7xl w-full px-4 md:px-6">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      Manajemen Libur Jadwal
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Kelola libur untuk jadwal latihan dan kelas
                    </p>
                  </div>

                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Libur Jadwal
                  </Button>
                </div>

                <div className="space-y-6 rounded-lg border bg-card p-6">
                  <HolidayToolbar
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                  />

                  <HolidayTable
                    data={data}
                    pageCount={meta?.total_page || 1}
                    pageSize={limit}
                    isLoading={isLoading}
                    onDeleteSuccess={fetchHolidays}
                    onEditSuccess={fetchHolidays}
                  />

                  <HolidayPagination
                    meta={meta || undefined}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    currentPage={page}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <AddHolidayModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchHolidays();
        }}
      />
    </SidebarProvider>
  );
}
