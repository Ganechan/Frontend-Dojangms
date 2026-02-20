"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ NEW
import { AppSidebar } from "@/components/admin/app-sidebar";
import { DataTable } from "@/pages/admin/user/data-table";
import type {
  ApiResponse,
  RoleCounts,
} from "@/components/admin/user/hooks/types";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ NEW: Initialize state dari URL query parameters
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
  const [activeRole, setActiveRole] = useState(() => {
    return searchParams.get("role") || "semua";
  });

  // ✅ NEW: Function untuk update URL
  const updateURL = (page: number, limit: number, role: string) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (role !== "semua") {
      params.set("role", role);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  async function fetchUsers(
    page: number,
    limit: number,
    role: string = "semua",
  ) {
    try {
      setIsLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

      let url = `${baseUrl}/api/admin/get/user?page=${page}&limit=${limit}`;
      if (role !== "semua") {
        url += `&role=${role}`;
      }

      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data pengguna");
      }

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
  }

  useEffect(() => {
    fetchUsers(currentPage, pageSize, activeRole);
  }, [currentPage, pageSize, activeRole]);

  // ✅ UPDATED: Update URL saat state berubah
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize, activeRole);
  };

  // ✅ UPDATED: Update URL saat state berubah
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(1, size, activeRole);
  };

  // ✅ UPDATED: Update URL saat state berubah
  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    setCurrentPage(1);
    updateURL(1, pageSize, role);
  };

  const roleCounts: RoleCounts | undefined = apiResponse
    ? {
        semua: apiResponse.meta.total_data,
        admin: apiResponse.totalAdmin,
        pelatih: apiResponse.totalPelatih,
        murid: apiResponse.totalMurid,
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
                  meta={apiResponse.meta}
                  roleCounts={roleCounts}
                  activeRole={activeRole}
                  onRoleChange={handleRoleChange}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
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
