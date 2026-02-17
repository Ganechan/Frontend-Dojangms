"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { DataTable, User } from "@/components/admin/user/data-table";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconLoader, IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function fetchUsers(isRefresh = false) {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

      const res = await fetch(`${baseUrl}/api/admin/get/user`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data pengguna");
      }

      const response = await res.json();

      if (response.data) {
        setUsers(response.data);
        if (isRefresh) {
          toast.success("Data berhasil diperbarui");
        }
      } else {
        throw new Error(response.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
      setUsers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers(true);
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
              {/* <SectionCards /> */}
              <div className="flex items-center justify-between px-4 lg:px-6">
                {/* <ChartAreaInteractive /> */}
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <IconRefresh className={isRefreshing ? "animate-spin" : ""} />
                  {isRefreshing ? "Memperbarui..." : "Refresh Data"}
                </Button>
              </div>
              {isLoading ? (
                <div className="flex h-[400px] w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <IconLoader className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Memuat data pengguna...
                    </p>
                  </div>
                </div>
              ) : (
                <DataTable data={users} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
