"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { DataTable } from "@/components/admin/anggota/data-table";
import type {
  ApiResponse,
  StatusCounts,
} from "@/components/admin/anggota/hooks/types";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";

export default function UserPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const limit = searchParams.get("limit");
    return limit ? parseInt(limit, 10) : 10;
  });

  const updateURL = (page: number, limit: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchUsers = useCallback(async (page: number, limit: number) => {
    try {
      setIsLoading(true);

      // ✅ endpoint baru
      const url = `http://localhost:3001/api/admin/get/user/murid?limit=${limit}&page=${page}`;

      const res = await fetch(url, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Gagal mengambil data pengguna");

      const response: ApiResponse = await res.json();

      if (response.data) {
        setApiResponse(response);
      } else {
        throw new Error(response.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
      setApiResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize, fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(1, size);
  };

  const handleSoftDeleteSuccess = useCallback(() => {
    fetchUsers(currentPage, pageSize);
  }, [fetchUsers, currentPage, pageSize]);

  const statusCounts: StatusCounts | undefined = apiResponse
    ? {
        total: Number(apiResponse.summary.total_murid),
        active: Number(apiResponse.summary.total_murid_active),
        inactive: Number(apiResponse.summary.total_murid_inactive),
      }
    : undefined;

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
              {isLoading ? (
                <div className="flex h-[400px] w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <IconLoader className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Memuat data pengguna...
                    </p>
                  </div>
                </div>
              ) : apiResponse ? (
                <DataTable
                  data={apiResponse.data}
                  pagination={apiResponse.pagination}
                  statusCounts={statusCounts}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  onSoftDeleteSuccess={handleSoftDeleteSuccess}
                />
              ) : (
                <div className="flex h-[400px] w-full items-center justify-center">
                  <p className="text-muted-foreground">Tidak ada data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
