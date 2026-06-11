"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ScheduleDataTable } from "@/components/admin/jadwal/jadwal-table";
import type {
    ScheduleData,
    ScheduleStatusCounts,
    PaginationMeta,
    ActiveScheduleTab,
    ScheduleType,
    Kelas,
    ScheduleApiResponse,
    KelasApiResponse,
} from "@/types/admin/jadwal";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const API_BASE = "http://localhost:3001/api/admin";

interface PageState {
    data: ScheduleData[];
    pagination: PaginationMeta | undefined;
    statusCounts: ScheduleStatusCounts | undefined;
    kelasList: Kelas[];
    isLoading: boolean;
    error: string | null;
}

export default function SchedulePage() {
    const searchParams = useSearchParams();

    const [pageState, setPageState] = useState<PageState>({
        data: [],
        pagination: undefined,
        statusCounts: undefined,
        kelasList: [],
        isLoading: true,
        error: null,
    });

    const [filters, setFilters] = useState({
        page: Number(searchParams.get("page")) || 1,
        limit: Number(searchParams.get("limit")) || 10,
        search: searchParams.get("search") || "",
        status: (searchParams.get("status") as ActiveScheduleTab) || "total",
        type: (searchParams.get("type") as ScheduleType | "all") || "all",
        kelas_id: searchParams.get("kelas_id")
            ? Number(searchParams.get("kelas_id"))
            : null,
    });

    // Fetch kelas list
    useEffect(() => {
        const fetchKelasList = async () => {
            try {
                const response = await fetch(
                    `${API_BASE}/kelas/getallkelas?page=1&limit=100`
                );
                const data: KelasApiResponse = await response.json();
                setPageState((prev) => ({
                    ...prev,
                    kelasList: data.data || [],
                }));
            } catch (error) {
                console.error("[v0] Error fetching kelas:", error);
            }
        };

        fetchKelasList();
    }, []);

    // Fetch schedule data
    const fetchScheduleData = useCallback(async () => {
        setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const params = new URLSearchParams();
            params.append("page", String(filters.page));
            params.append("limit", String(filters.limit));

            if (filters.search) {
                params.append("search", filters.search);
            }

            if (filters.status !== "total") {
                params.append("status", filters.status);
            }

            if (filters.type !== "all") {
                params.append("tipe", filters.type);
            }

            if (filters.kelas_id !== null && filters.type === "kelas") {
                params.append("kelas_id", String(filters.kelas_id));
            }

            const response = await fetch(`${API_BASE}/jadwal?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch schedule data");
            }

            const data: ScheduleApiResponse = await response.json();

            // Calculate status counts
            const statusCounts: ScheduleStatusCounts = {
                total: data.summary.total_jadwal,
                aktif: Number(data.summary.total_aktif),
                nonaktif: Number(data.summary.total_nonaktif),
            };

            setPageState((prev) => ({
                ...prev,
                data: data.data || [],
                pagination: data.pagination,
                statusCounts,
                isLoading: false,
            }));
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown error occurred";
            console.error("[v0] Error fetching schedule data:", error);
            setPageState((prev) => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
        }
    }, [filters]);

    useEffect(() => {
        fetchScheduleData();
    }, [fetchScheduleData]);

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handlePageSizeChange = (newLimit: number) => {
        setFilters((prev) => ({ ...prev, page: 1, limit: newLimit }));
    };

    const handleSearchChange = (search: string) => {
        setFilters((prev) => ({ ...prev, search, page: 1 }));
    };

    const handleStatusChange = (status: ActiveScheduleTab) => {
        setFilters((prev) => ({ ...prev, status, page: 1 }));
    };

    const handleTypeChange = (type: ScheduleType | "all") => {
        setFilters((prev) => ({
            ...prev,
            type,
            kelas_id: null,
            page: 1,
        }));
    };

    const handleKelasChange = (kelasId: number | null) => {
        setFilters((prev) => ({ ...prev, kelas_id: kelasId, page: 1 }));
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
                            <div className="px-4 lg:px-6">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    Manajemen Jadwal
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Kelola semua jadwal latihan, kelas, dan training camp
                                </p>
                            </div>

                            {pageState.error && (
                                <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
                                    Terjadi kesalahan: {pageState.error}
                                </div>
                            )}

                            <ScheduleDataTable
                                data={pageState.data}
                                pagination={pageState.pagination}
                                statusCounts={pageState.statusCounts}
                                kelasList={pageState.kelasList}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                onSearchChange={handleSearchChange}
                                onStatusChange={handleStatusChange}
                                onTypeChange={handleTypeChange}
                                onKelasChange={handleKelasChange}
                                onRefresh={fetchScheduleData}
                                initialSearch={filters.search}
                                initialStatus={filters.status}
                                initialType={filters.type}
                                initialKelasId={filters.kelas_id}
                                isLoading={pageState.isLoading}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}