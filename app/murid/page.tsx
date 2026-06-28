"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/murid/app-sidebar";
import { SiteHeader } from "@/components/murid/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import type { MuridDashboardData } from "@/components/murid/murid-dashboard/types";
import { SummaryCards } from "@/components/murid/murid-dashboard/summary-cards";
import { JadwalLatihan } from "@/components/murid/murid-dashboard/jadwal-latihan";
import { KelasSaya } from "@/components/murid/murid-dashboard/kelas-saya";
import { AbsensiStatistik } from "@/components/murid/murid-dashboard/absensi-statistik";
import { RiwayatAbsensi } from "@/components/murid/murid-dashboard/riwayat-absensi";
import { Pengumuman } from "@/components/murid/murid-dashboard/pengumuman";
import { Prestasi } from "@/components/murid/murid-dashboard/prestasi";
import { UjianSaya } from "@/components/murid/murid-dashboard/ujian-saya";
import { AgendaMendatang } from "@/components/murid/murid-dashboard/agenda-mendatang";

// Gunakan internal API
const API_URL = "/api/admin/murid/dashboard";

export default function MuridDashboardPage() {
  const [data, setData] = useState<MuridDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL, {
        credentials: "include", // kirim cookie httpOnly
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memuat data");
      }
      const json = await res.json();
      // Perbaikan: response bisa berupa { success: true, data: DashboardData }
      // atau langsung DashboardData. Sesuaikan di sini.
      const dashboardData = json.success ? json.data : json;
      setData(dashboardData);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
              <main className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                  {/* Header */}
                  <header className="mb-8">
                    {loading ? (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-96" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight text-balance">
                          Dashboard Murid
                        </h1>
                        <p className="text-sm text-muted-foreground text-pretty">
                          Selamat datang. Berikut ringkasan kelas, jadwal latihan, absensi, pengumuman,
                          prestasi, dan ujian Anda.
                        </p>
                      </div>
                    )}
                  </header>

                  {/* Error state */}
                  {error && !loading && (
                    <Alert variant="destructive" className="mb-8">
                      <AlertCircle className="size-4" />
                      <AlertTitle>Gagal Memuat Dashboard</AlertTitle>
                      <AlertDescription className="flex items-center justify-between gap-4 mt-1">
                        <span>Terjadi kesalahan saat mengambil data dashboard.</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchDashboard}
                          className="shrink-0"
                        >
                          <RefreshCw className="size-3.5 mr-2" />
                          Coba Lagi
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col gap-6">
                    {/* Section 1: Summary Cards */}
                    <SummaryCards data={data} loading={loading} />

                    {/* Section 2: Jadwal Latihan + Kelas Saya */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                      <div className="lg:col-span-8">
                        <JadwalLatihan data={data} loading={loading} />
                      </div>
                      <div className="lg:col-span-4">
                        <KelasSaya data={data} loading={loading} />
                      </div>
                    </div>

                    {/* Section 3: Statistik Absensi + Riwayat Absensi */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <AbsensiStatistik data={data} loading={loading} />
                      <RiwayatAbsensi data={data} loading={loading} />
                    </div>

                    {/* Section 4: Pengumuman + Prestasi */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <Pengumuman data={data} loading={loading} />
                      <Prestasi data={data} loading={loading} />
                    </div>

                    {/* Section 5: Ujian Saya + Agenda Mendatang */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <UjianSaya data={data} loading={loading} />
                      <AgendaMendatang data={data} loading={loading} />
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}