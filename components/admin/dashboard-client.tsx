"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  School,
  BookOpen,
  Trophy,
  CalendarClock,
  ClipboardCheck,
  ClipboardPen,
  Award,
  UserPlus,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

interface DashboardData {
  users: {
    total: number;
    active: string;
    inactive: string;
    murid: string;
    pelatih: string;
    admin: string;
    new_this_month: number;
  };
  classes: {
    total: number;
    aktif: string;
    nonaktif: string;
  };
  attendance: {
    today: {
      hadir: number;
      izin: number;
      sakit: number;
      alpha: number;
    };
    total: number;
    persentase_hadir: number;
  };
  competitions: {
    berlangsung: string;
    akan_datang: string;
    total_peserta_aktif: number;
  };
  belt_exams: {
    akan_datang: string;
    selesai_bulan_ini: string;
    belum_diinput: number;
  };
  recent_activities: RecentActivity[];
}

interface RecentActivity {
  id: number;
  tipe: "absensi" | "ujian" | "kejuaraan" | "pengguna";
  deskripsi: string;
  waktu: string;
}

interface UserGrowthData {
  period: string;
  labels: string[];
  total: number[];
  murid: number[];
  pelatih: number[];
  admin: number[];
}

// ─── Helper: format label "2026-06" → "Jun 2026" ─────────────────────────────

function formatLabel(label: string): string {
  const [year, month] = label.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

// ─── Skeleton Components ──────────────────────────────────────────────────────

function SummaryCardSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function TimelineSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  badge,
}: SummaryCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1 leading-none">
              {value}
            </p>
            {badge && (
              <Badge
                variant="secondary"
                className="mt-2 text-xs font-normal px-1.5 py-0.5"
              >
                {badge}
              </Badge>
            )}
          </div>
          <div
            className={cn(
              "flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center",
              iconBg
            )}
          >
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard Client Component ──────────────────────────────────────────

export default function AdminDashboardClient() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    String(currentYear)
  );
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [growthData, setGrowthData] = useState<UserGrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const yearOptions = Array.from({ length: 5 }, (_, i) =>
    String(currentYear - i)
  );

  const fetchDashboard = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat dashboard");
      }
      const data = await res.json();
      if (data.success) {
        setDashboardData(data.data);
      } else {
        throw new Error(data.message || "Gagal memuat dashboard");
      }
    } catch (err: any) {
      setError("dashboard");
      toast.error(err.message || "Gagal memuat dashboard");
    }
  };

  const fetchGrowth = async (year: string) => {
    try {
      const res = await fetch(`/api/admin/dashboard/user-growth?year=${year}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memuat data pertumbuhan");
      }
      const data = await res.json();
      if (data.success) {
        setGrowthData(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data pertumbuhan pengguna");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchGrowth(selectedYear)]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) fetchGrowth(selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  // ── Chart data ──
  const chartData =
    growthData?.labels.map((label, i) => ({
      name: formatLabel(label),
      Total: growthData.total[i],
      Murid: growthData.murid[i],
      Pelatih: growthData.pelatih[i],
      Admin: growthData.admin[i],
    })) ?? [];

  // ── Activity icon map ──
  const activityIcon: Record<RecentActivity["tipe"], React.ElementType> = {
    absensi: ClipboardCheck,
    ujian: Award,
    kejuaraan: Trophy,
    pengguna: UserPlus,
  };

  const activityColor: Record<RecentActivity["tipe"], string> = {
    absensi: "bg-blue-100 text-blue-600",
    ujian: "bg-purple-100 text-purple-600",
    kejuaraan: "bg-amber-100 text-amber-600",
    pengguna: "bg-emerald-100 text-emerald-600",
  };

  // ── Attendance total ──
  const attendanceTotal = dashboardData
    ? dashboardData.attendance.today.hadir +
    dashboardData.attendance.today.izin +
    dashboardData.attendance.today.sakit +
    dashboardData.attendance.today.alpha
    : 0;

  // ── User composition max ──
  const userTotal = dashboardData ? dashboardData.users.total : 1;

  // ─── Error State ────────────────────────────────────────────────────────────
  if (!loading && error === "dashboard") {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle className="font-semibold">
            Gagal Memuat Dashboard
          </AlertTitle>
          <AlertDescription className="mt-1">
            Terjadi kesalahan saat mengambil data dashboard.
          </AlertDescription>
          <Button
            size="sm"
            variant="destructive"
            className="mt-3"
            onClick={() => {
              setLoading(true);
              Promise.all([fetchDashboard(), fetchGrowth(selectedYear)]).then(
                () => setLoading(false)
              );
            }}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Coba Lagi
          </Button>
        </Alert>
      </div>
    );
  }

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-4">
            <ChartSkeleton />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <TimelineSkeleton />
      </div>
    );
  }

  const d = dashboardData!;

  // ─── Full Dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 sm:p-6 space-y-6 max-w-screen-2xl mx-auto">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Ringkasan aktivitas dan statistik sistem Dojang Management System.
            </p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-36 bg-white border-slate-200 shadow-sm">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── 8 Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Pengguna"
            value={d.users.total}
            icon={Users}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
          />
          <SummaryCard
            title="Pengguna Aktif"
            value={d.users.active}
            icon={UserCheck}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            badge="Aktif"
          />
          <SummaryCard
            title="Total Kelas"
            value={d.classes.total}
            icon={School}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          <SummaryCard
            title="Kelas Aktif"
            value={d.classes.aktif}
            icon={BookOpen}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            badge="Aktif"
          />
          <SummaryCard
            title="Kejuaraan Berlangsung"
            value={d.competitions.berlangsung}
            icon={Trophy}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />
          <SummaryCard
            title="Kejuaraan Akan Datang"
            value={d.competitions.akan_datang}
            icon={CalendarClock}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <SummaryCard
            title="Ujian Akan Datang"
            value={d.belt_exams.akan_datang}
            icon={ClipboardCheck}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <SummaryCard
            title="Ujian Belum Diinput"
            value={d.belt_exams.belum_diinput}
            icon={ClipboardPen}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* ── Chart Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* User Growth Chart */}
          <div className="lg:col-span-8">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Pertumbuhan Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                    Tidak ada data pertumbuhan untuk tahun {selectedYear}.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        width={32}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow:
                            "0 4px 20px rgba(0,0,0,0.10)",
                          fontSize: "13px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Total"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Murid"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Pelatih"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Admin"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Composition */}
          <div className="lg:col-span-4">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Komposisi Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-500">
                      Total Pengguna
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {d.users.total}
                    </span>
                  </div>
                  <Progress value={100} className="h-2 bg-slate-100 [&>div]:bg-indigo-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-500">Murid</span>
                    <span className="text-sm font-bold text-slate-800">
                      {d.users.murid}
                    </span>
                  </div>
                  <Progress
                    value={(Number(d.users.murid) / userTotal) * 100}
                    className="h-2 bg-slate-100 [&>div]:bg-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-500">Pelatih</span>
                    <span className="text-sm font-bold text-slate-800">
                      {d.users.pelatih}
                    </span>
                  </div>
                  <Progress
                    value={(Number(d.users.pelatih) / userTotal) * 100}
                    className="h-2 bg-slate-100 [&>div]:bg-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-500">Admin</span>
                    <span className="text-sm font-bold text-slate-800">
                      {d.users.admin}
                    </span>
                  </div>
                  <Progress
                    value={(Number(d.users.admin) / userTotal) * 100}
                    className="h-2 bg-slate-100 [&>div]:bg-red-500"
                  />
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Baru Bulan Ini
                    </span>
                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-0 font-semibold">
                      +{d.users.new_this_month}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Attendance + Competition Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Attendance Summary */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500" />
                Statistik Absensi Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-700">
                    {d.attendance.today.hadir}
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5 font-medium">
                    Hadir
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">
                    {d.attendance.today.izin}
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5 font-medium">
                    Izin
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">
                    {d.attendance.today.sakit}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5 font-medium">
                    Sakit
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-center">
                  <p className="text-2xl font-bold text-red-700">
                    {d.attendance.today.alpha}
                  </p>
                  <p className="text-xs text-red-600 mt-0.5 font-medium">
                    Alpha
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600 font-medium">
                    Persentase Kehadiran
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {d.attendance.persentase_hadir}%
                  </span>
                </div>
                <Progress
                  value={d.attendance.persentase_hadir}
                  className="h-2.5 bg-slate-100 [&>div]:bg-emerald-500"
                />
                {attendanceTotal === 0 && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    Belum ada data absensi hari ini.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Competition + Exam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kejuaraan */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Kejuaraan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">
                    Sedang Berlangsung
                  </span>
                  <span className="text-lg font-bold text-orange-600">
                    {d.competitions.berlangsung}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Akan Datang</span>
                  <span className="text-lg font-bold text-blue-600">
                    {d.competitions.akan_datang}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">
                    Total Peserta Aktif
                  </span>
                  <span className="text-lg font-bold text-slate-800">
                    {d.competitions.total_peserta_aktif}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Ujian Sabuk */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  Ujian Sabuk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Akan Datang</span>
                  <span className="text-lg font-bold text-purple-600">
                    {d.belt_exams.akan_datang}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">
                    Selesai Bulan Ini
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {d.belt_exams.selesai_bulan_ini}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">Belum Input</span>
                  <span className="text-lg font-bold text-red-600">
                    {d.belt_exams.belum_diinput}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Recent Activities ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {d.recent_activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Activity className="h-9 w-9 text-slate-300" />
                </div>
                <h3 className="text-base font-semibold text-slate-600 mb-1">
                  Belum Ada Aktivitas
                </h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  Aktivitas terbaru akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[17px] top-0 bottom-0 w-px bg-slate-100" />
                <div className="space-y-4">
                  {d.recent_activities.map((activity, idx) => {
                    const Icon = activityIcon[activity.tipe] ?? Activity;
                    const colorClass = activityColor[activity.tipe] ?? "bg-slate-100 text-slate-600";
                    return (
                      <div
                        key={activity.id ?? idx}
                        className="flex gap-3 items-start"
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center z-10",
                            colorClass
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3">
                          <p className="text-sm text-slate-700 leading-snug">
                            {activity.deskripsi}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {activity.waktu}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
