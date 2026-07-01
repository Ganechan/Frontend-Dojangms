// app\pelatih\absensi\page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Eye,
  AlertCircle,
  Filter,
  X,
  CheckSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/pelatih/app-sidebar";
import { SiteHeader } from "@/components/pelatih/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Jadwal {
  id: number;
  nama: string;
  tipe: string;
  hari: string;
  effective_from: string;
  effective_until: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  keterangan: string | null;
  status: "aktif" | "nonaktif";
  kelas: {
    id: number;
    nama: string;
    status: string;
  } | null;
}

interface GlobalHoliday {
  id: number;
  tanggal: string;
  keterangan: string;
  created_at: string;
}

interface ScheduleHoliday {
  id: number;
  jadwal_id: number;
  tanggal: string;
  keterangan: string;
  created_at: string;
  jadwal_nama: string;
  jadwal_tipe: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Jadwal[];
  meta: {
    pagination: {
      current_page: number;
      per_page: number;
      total_page: number;
      total_data: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

const fetchSchedules = async (
  page: number,
  limit: number,
  status: string,
  hari: string,
): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append("status", status);
  if (hari) params.append("hari", hari);

  const response = await fetch(`/api/pelatih/jadwal?${params}`);
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Gagal memuat data" }));
    throw new Error(errorData.message || "Gagal memuat data");
  }
  return await response.json();
};

const API_BASE_URL = "https://api.jokotingkir-tc.online";

const fetchHolidayPages = async <T,>(url: string): Promise<T[]> => {
  let page = 1;
  let hasNext = true;
  const allData: T[] = [];

  while (hasNext) {
    const separator = url.includes("?") ? "&" : "?";

    const response = await fetch(`${url}${separator}page=${page}&limit=100`, {
      cache: "no-store",
    });

    const result = await response
      .json()
      .catch(() => ({ message: "Gagal memuat data libur", data: [] }));

    if (!response.ok) {
      throw new Error(result.message || "Gagal memuat data libur");
    }

    allData.push(...(result.data || []));
    hasNext = Boolean(result.pagination?.has_next);
    page += 1;
  }

  return allData;
};

const fetchGlobalHolidays = async (): Promise<GlobalHoliday[]> => {
  return fetchHolidayPages<GlobalHoliday>(
    `${API_BASE_URL}/api/admin/jadwal/libur-global/get`,
  );
};

const fetchScheduleHolidays = async (
  jadwalId: number,
): Promise<ScheduleHoliday[]> => {
  return fetchHolidayPages<ScheduleHoliday>(
    `${API_BASE_URL}/api/admin/jadwal/libur/all?jadwal_id=${jadwalId}`,
  );
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return dateString;
  }
};

const formatTime = (timeString: string): string => {
  if (!timeString) return "-";
  try {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  } catch {
    return timeString;
  }
};

const getStatusBadgeVariant = (status: string) => {
  if (status === "aktif") return "default";
  return "secondary";
};

const getStatusLabel = (status: string) =>
  status === "aktif" ? "Aktif" : "Nonaktif";

const getHariLabel = (hari: string) => {
  const map: Record<string, string> = {
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jumat",
    sabtu: "Sabtu",
    minggu: "Minggu",
  };
  return map[hari] || hari;
};

const TIMEZONE = "Asia/Jakarta";

const getNowJakarta = () => {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || "";

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");
  const weekday = getPart("weekday").toLowerCase();

  return {
    date: `${year}-${month}-${day}`,
    hari: weekday,
    minutes: Number(hour) * 60 + Number(minute),
    time: `${hour}:${minute}:${second}`,
  };
};

const normalizeDateOnly = (value: string | null) => {
  if (!value) return null;
  return value.slice(0, 10);
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isDateInRange = (
  selectedDate: string,
  startDate: string | null,
  endDate: string | null,
) => {
  const start = normalizeDateOnly(startDate);
  const end = normalizeDateOnly(endDate);

  if (start && selectedDate < start) return false;
  if (end && selectedDate > end) return false;

  return true;
};

const isTimeInRange = (
  currentMinutes: number,
  startTime: string,
  endTime: string,
) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  // Normal: 08:00 - 10:00
  if (start <= end) {
    return currentMinutes >= start && currentMinutes <= end;
  }

  // Kalau jadwal melewati tengah malam, contoh: 22:00 - 01:00
  return currentMinutes >= start || currentMinutes <= end;
};

const getHolidayStatus = (
  selectedDate: string,
  globalHolidays: GlobalHoliday[],
  scheduleHolidays: ScheduleHoliday[],
) => {
  const globalHoliday = globalHolidays.find(
    (holiday) => holiday.tanggal.slice(0, 10) === selectedDate,
  );

  if (globalHoliday) {
    return {
      isHoliday: true,
      reason: `Libur global: ${globalHoliday.keterangan}`,
    };
  }

  const scheduleHoliday = scheduleHolidays.find(
    (holiday) => holiday.tanggal.slice(0, 10) === selectedDate,
  );

  if (scheduleHoliday) {
    return {
      isHoliday: true,
      reason: `Libur jadwal: ${scheduleHoliday.keterangan}`,
    };
  }

  return {
    isHoliday: false,
    reason: "",
  };
};

const getAttendanceButtonStatus = (
  jadwal: Jadwal,
  selectedDate: string,
  now: ReturnType<typeof getNowJakarta>,
  globalHolidays: GlobalHoliday[],
  scheduleHolidays: ScheduleHoliday[],
) => {
  if (jadwal.status !== "aktif") {
    return {
      allowed: false,
      reason: "Jadwal nonaktif",
    };
  }

  const holidayStatus = getHolidayStatus(
    selectedDate,
    globalHolidays,
    scheduleHolidays,
  );

  if (holidayStatus.isHoliday) {
    return {
      allowed: false,
      reason: holidayStatus.reason,
    };
  }

  if (selectedDate !== now.date) {
    return {
      allowed: false,
      reason: "Absensi hanya aktif untuk tanggal hari ini",
    };
  }

  if (jadwal.hari.toLowerCase() !== now.hari) {
    return {
      allowed: false,
      reason: `Absensi hanya aktif hari ${getHariLabel(jadwal.hari)}`,
    };
  }

  if (
    !isDateInRange(selectedDate, jadwal.effective_from, jadwal.effective_until)
  ) {
    return {
      allowed: false,
      reason: "Tanggal di luar periode jadwal aktif",
    };
  }

  if (
    !isDateInRange(selectedDate, jadwal.tanggal_mulai, jadwal.tanggal_selesai)
  ) {
    return {
      allowed: false,
      reason: "Tanggal di luar rentang jadwal",
    };
  }

  if (!isTimeInRange(now.minutes, jadwal.jam_mulai, jadwal.jam_selesai)) {
    return {
      allowed: false,
      reason: `Aktif pukul ${formatTime(jadwal.jam_mulai)} - ${formatTime(
        jadwal.jam_selesai,
      )} WIB`,
    };
  }

  return {
    allowed: true,
    reason: "Bisa absensi",
  };
};

export default function SchedulesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [hariFilter, setHariFilter] = useState<string>("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    () => getNowJakarta().date,
  );

  const [nowJakarta, setNowJakarta] = useState(() => getNowJakarta());
  const [globalHolidays, setGlobalHolidays] = useState<GlobalHoliday[]>([]);

  const [scheduleHolidaysByJadwalId, setScheduleHolidaysByJadwalId] = useState<
    Record<number, ScheduleHoliday[]>
  >({});
  const limit = 10;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchSchedules(
        page,
        limit,
        statusFilter,
        hariFilter,
      );

      const globalHolidayData = await fetchGlobalHolidays();

      const scheduleHolidayEntries = await Promise.all(
        result.data.map(async (jadwal) => {
          const holidays = await fetchScheduleHolidays(jadwal.id);
          return [jadwal.id, holidays] as const;
        }),
      );

      setData(result);
      setGlobalHolidays(globalHolidayData);
      setScheduleHolidaysByJadwalId(Object.fromEntries(scheduleHolidayEntries));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Gagal memuat data"));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, hariFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowJakarta(getNowJakarta());
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  const pagination = data?.meta?.pagination;
  const schedules = data?.data || [];

  const isEmpty = !loading && schedules.length === 0 && !error;
  const hasError = error !== null;

  const handleRefresh = () => {
    loadData();
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setHariFilter("");
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
              <div className="space-y-6">
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                  {/* Main Content */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header & Breadcrumb */}
                    <div className="mb-6">
                      <div className="mt-4">
                        <h1 className="text-3xl font-bold text-slate-900">
                          Absensi
                        </h1>
                        <p className="text-slate-600 mt-1">
                          Lakukan Absensi semua jadwal mengajar Anda.
                        </p>
                      </div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tanggal Absensi
                          </label>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Status
                          </label>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua Status</SelectItem>
                              <SelectItem value="aktif">Aktif</SelectItem>
                              <SelectItem value="nonaktif">Nonaktif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Hari
                          </label>
                          <Select
                            value={hariFilter}
                            onValueChange={setHariFilter}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Semua Hari" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua Hari</SelectItem>
                              <SelectItem value="senin">Senin</SelectItem>
                              <SelectItem value="selasa">Selasa</SelectItem>
                              <SelectItem value="rabu">Rabu</SelectItem>
                              <SelectItem value="kamis">Kamis</SelectItem>
                              <SelectItem value="jumat">Jumat</SelectItem>
                              <SelectItem value="sabtu">Sabtu</SelectItem>
                              <SelectItem value="minggu">Minggu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={loading}
                            title="Refresh data"
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            disabled={!statusFilter && !hariFilter}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reset Filter
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Error State */}
                    {hasError && (
                      <Alert variant="destructive" className="mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Gagal Memuat Data</AlertTitle>
                        <AlertDescription>
                          {error?.message ||
                            "Terjadi kesalahan saat mengambil data jadwal."}
                        </AlertDescription>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          className="mt-4"
                        >
                          Coba Lagi
                        </Button>
                      </Alert>
                    )}

                    {/* Loading State */}
                    {loading && (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse"
                          >
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty State */}
                    {isEmpty && (
                      <Card className="border-slate-200 text-center py-12">
                        <CardContent className="flex flex-col items-center gap-4">
                          <div className="rounded-full bg-slate-100 p-4">
                            <Calendar className="h-8 w-8 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              Tidak Ada Jadwal
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                              {statusFilter || hariFilter
                                ? "Tidak ada jadwal yang sesuai dengan filter yang dipilih."
                                : "Anda belum memiliki jadwal mengajar."}
                            </p>
                          </div>
                          {(statusFilter || hariFilter) && (
                            <Button
                              variant="outline"
                              onClick={handleResetFilters}
                              className="mt-4"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Hapus Filter
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Data Table */}
                    {!loading && !isEmpty && !hasError && (
                      <>
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Nama Jadwal
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Hari
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Jam
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Lokasi
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Kelas
                                  </th>
                                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                                    Aksi
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {schedules.map((jadwal) => (
                                  <tr
                                    key={jadwal.id}
                                    className="hover:bg-slate-50 transition-colors"
                                  >
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                      {jadwal.nama}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                      {getHariLabel(jadwal.hari)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                      {formatTime(jadwal.jam_mulai)} -{" "}
                                      {formatTime(jadwal.jam_selesai)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                      {jadwal.lokasi}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                      {jadwal.kelas?.nama || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                      {(() => {
                                        const attendanceStatus =
                                          getAttendanceButtonStatus(
                                            jadwal,
                                            selectedDate,
                                            nowJakarta,
                                            globalHolidays,
                                            scheduleHolidaysByJadwalId[
                                              jadwal.id
                                            ] || [],
                                          );

                                        if (!attendanceStatus.allowed) {
                                          return (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              disabled
                                              title={attendanceStatus.reason}
                                              className="text-slate-400 cursor-not-allowed"
                                            >
                                              <CheckSquare className="h-4 w-4 mr-1" />
                                              Absensi
                                            </Button>
                                          );
                                        }

                                        return (
                                          <Link
                                            href={`/pelatih/absensi/${jadwal.id}?tanggal=${selectedDate}`}
                                          >
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-blue-600 hover:text-blue-700"
                                            >
                                              <CheckSquare className="h-4 w-4 mr-1" />
                                              Absensi
                                            </Button>
                                          </Link>
                                        );
                                      })()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Pagination */}
                        {pagination && (
                          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-slate-600">
                              Menampilkan {(page - 1) * limit + 1} -{" "}
                              {Math.min(page * limit, pagination.total_data)}{" "}
                              dari {pagination.total_data} jadwal
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                disabled={!pagination.has_prev || loading}
                                onClick={() =>
                                  setPage((p) => Math.max(p - 1, 1))
                                }
                              >
                                Sebelumnya
                              </Button>
                              <Button
                                variant="outline"
                                disabled={!pagination.has_next || loading}
                                onClick={() => setPage((p) => p + 1)}
                              >
                                Selanjutnya
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
