"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/pelatih/pelatih-dashboard/summary-cards";
import { AbsensiCard } from "@/components/pelatih/pelatih-dashboard/absensi-card";
import { KelasSummary } from "@/components/pelatih/pelatih-dashboard/kelas-summary";
import { JadwalLatihanCard } from "@/components/pelatih/pelatih-dashboard/jadwal-latihan";
import { AktivitasTerbaru } from "@/components/pelatih/pelatih-dashboard/aktivitas-terbaru";
import { KejuaraanCard } from "@/components/pelatih/pelatih-dashboard/kejuaraan-card";
import { UjianCard } from "@/components/pelatih/pelatih-dashboard/ujian-card";
import type { DashboardData } from "@/components/pelatih/pelatih-dashboard/types";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const API_URL = "/api/admin/pelatih/dashboard";

export default function PelatihDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL, {
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memuat data");
      }
      const json = await res.json();

      // 🔥 Perbaikan: response bisa berupa { success: true, data: DashboardData }
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
              <div className="space-y-6">
                <main className="min-h-screen bg-background">
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <header className="mb-8">
                      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Dashboard Pelatih
                      </h1>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        Selamat datang. Berikut ringkasan kelas, absensi, jadwal latihan, kejuaraan, dan ujian yang Anda ampu.
                      </p>
                    </header>

                    {/* Error State */}
                    {error && !loading && (
                      <Alert variant="destructive" className="mb-8">
                        <AlertCircle className="size-4" />
                        <AlertTitle>Gagal Memuat Dashboard</AlertTitle>
                        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <span>Terjadi kesalahan saat mengambil data dashboard.</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchDashboard}
                            className="w-fit"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Coba Lagi
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-col gap-6">
                      <SummaryCards data={data} loading={loading} />
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                          <AbsensiCard data={data} loading={loading} />
                        </div>
                        <div className="lg:col-span-4">
                          <KelasSummary data={data} loading={loading} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <JadwalLatihanCard
                          data={data?.jadwal_terdekat ?? []}
                          loading={loading}
                        />
                        <AktivitasTerbaru
                          data={data?.aktivitas_terbaru ?? []}
                          loading={loading}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <KejuaraanCard
                          data={data?.kejuaraan_akan_datang ?? []}
                          loading={loading}
                        />
                        <UjianCard
                          data={data?.ujian_akan_datang ?? []}
                          loading={loading}
                        />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}