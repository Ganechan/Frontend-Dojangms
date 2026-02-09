// app\admin\page.tsx
"use client";

import React, { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Users, Trophy, UserPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const memberGrowthData = [
  { month: "Jan", members: 150 },
  { month: "Feb", members: 180 },
  { month: "Mar", members: 220 },
  { month: "Apr", members: 250 },
  { month: "May", members: 290 },
  { month: "Jun", members: 340 },
];

const lineChartConfig = {
  members: {
    label: "Jumlah Anggota",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  count: {
    label: "Jumlah Anggota",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const beltChartConfig = {
  count: {
    label: "Jumlah Anggota",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const StatCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconBgColor,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  bgColor: string;
  iconBgColor: string;
  isLoading?: boolean;
}) => (
  <Card
    className={`relative overflow-hidden ${bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
  >
    {/* Decorative background pattern */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white transform translate-x-4"></div>
    </div>

    <div className="relative p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-10 w-24 bg-white/20 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-4xl font-bold text-white">
                {value.toLocaleString()}
              </h3>
            )}
          </div>
        </div>
        <div className={`${iconBgColor} p-4 rounded-2xl shadow-lg`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  </Card>
);

interface BeltDistribution {
  belt: string;
  count: number;
}

interface BeltMaster {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

interface Activity {
  id: number;
  date: string;
  activity: string;
  user: string;
  status: string;
}

const defaultRecentActivities: Activity[] = [
  {
    id: 1,
    date: "2024-01-15",
    activity: "Pendaftaran Anggota Baru",
    user: "Ahmad Ridho",
    status: "Sukses",
  },
  {
    id: 2,
    date: "2024-01-14",
    activity: "Ujian Sabuk Yellow",
    user: "Siti Nurhaliza",
    status: "Lulus",
  },
  {
    id: 3,
    date: "2024-01-13",
    activity: "Pendaftaran Kejuaraan",
    user: "Budi Santoso",
    status: "Menunggu",
  },
  {
    id: 4,
    date: "2024-01-12",
    activity: "Ujian Sabuk Green",
    user: "Dewi Lestari",
    status: "Lulus",
  },
  {
    id: 5,
    date: "2024-01-11",
    activity: "Pendaftaran Anggota Baru",
    user: "Rian Pratama",
    status: "Sukses",
  },
];

export default function Dashboard() {
  const [totalActiveMembers, setTotalActiveMembers] = useState(0);
  const [beltDistributionData, setBeltDistributionData] = useState<
    BeltDistribution[]
  >([]);
  const [beltMaster, setBeltMaster] = useState<BeltMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getBeltColor = (beltName: string) => {
    const name = beltName.toLocaleLowerCase();

    if (name.includes("putih")) return "#E5E7EB";
    if (name.includes("kuning")) return "#FACC15";
    if (name.includes("hijau")) return "#22C55E";
    if (name.includes("biru")) return "#3B82F6";
    if (name.includes("merah") && !name.includes("hitam")) return "#EF4444";
    if (name.includes("hitam")) return "#111827";
    if (name.includes("dan")) return "#0F172A";

    return "#6366F1";
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, beltRes] = await Promise.all([
          fetch(`${BASE_URL}/api/admin/get/user`),
          fetch(`${BASE_URL}/api/public/get/belt`),
        ]);

        const userResult = await userRes.json();
        const beltResult = await beltRes.json();

        if (beltResult?.data) {
          setBeltMaster(beltResult.data);
        }

        if (userResult?.data) {
          const activeCount = userResult.data.filter(
            (user: any) => user.status === "active",
          ).length;
          setTotalActiveMembers(activeCount);

          const beltCount: Record<string, number> = {};

          userResult.data.forEach((user: any) => {
            const belt = user.current_belt || "Putih";
            beltCount[belt] = (beltCount[belt] || 0) + 1;
          });

          setBeltDistributionData(
            Object.entries(beltCount).map(([belt, count]) => ({
              belt,
              count,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [BASE_URL]);

  const chartBeltData = beltMaster
    .map((belt) => {
      const found = beltDistributionData.find((b) => b.belt === belt.name);

      return {
        belt: belt.name,
        count: found?.count ?? 0,
        order: belt.order_level,
      };
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Selamat datang kembali, Admin 👋
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Anggota Aktif"
          value={totalActiveMembers}
          icon={Users}
          bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          iconBgColor="bg-blue-400/30"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Kejuaraan"
          value={24}
          icon={Trophy}
          bgColor="bg-gradient-to-br from-amber-500 to-amber-600"
          iconBgColor="bg-amber-400/30"
        />
        <StatCard
          title="Anggota Baru"
          value={28}
          icon={UserPlus}
          bgColor="bg-gradient-to-br from-green-500 to-green-600"
          iconBgColor="bg-green-400/30"
        />
        <StatCard
          title="Kejuaraan Mendatang"
          value={5}
          icon={Calendar}
          bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
          iconBgColor="bg-purple-400/30"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Pertumbuhan Anggota</CardTitle>
            <CardDescription>6 Bulan Terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig}>
              <LineChart data={memberGrowthData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ fill: "var(--chart-1)", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Distribusi Sabuk</CardTitle>
            <CardDescription>
              Proporsi anggota berdasarkan tingkat sabuk
            </CardDescription>
          </CardHeader>

          <CardContent className="h-80">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Memuat data...
              </div>
            ) : chartBeltData.length > 0 ? (
              <ChartContainer config={pieChartConfig}>
                <PieChart>
                  <Pie
                    data={chartBeltData.filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="belt"
                    outerRadius={90}
                    innerRadius={0}
                    paddingAngle={2}
                    label={({ belt, count }) => `${belt}: ${count}`}
                  >
                    {chartBeltData.map((entry, index) => (
                      <Cell key={index} fill={getBeltColor(entry.belt)} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    cursor={true}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                            <p className="font-semibold text-sm">
                              {payload[0].payload.belt}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value} anggota
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Tidak ada data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart with shadcn style */}
      <Card className="border-0 shadow-sm hidden md:block">
        <CardHeader>
          <CardTitle>Distribusi Anggota per Tingkat Sabuk</CardTitle>
          <CardDescription>
            {isLoading ? (
              <span className="inline-block h-4 w-32 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              `Total ${beltDistributionData.reduce((acc, curr) => acc + curr.count, 0)} anggota terdaftar`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground">Memuat data...</div>
            </div>
          ) : beltDistributionData.length > 0 ? (
            <ChartContainer config={beltChartConfig}>
              <BarChart
                accessibilityLayer
                data={beltDistributionData}
                margin={{
                  top: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="belt"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground">
                Tidak ada data distribusi sabuk
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities Table */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Tanggal
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Aktivitas
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {defaultRecentActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-muted-foreground">
                        {activity.date}
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {activity.activity}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {activity.user}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            activity.status === "Sukses"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "Lulus"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-6">
                + Tambah Anggota Baru
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-6">
                + Buat Kejuaraan Baru
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-6">
                + Jadwalkan Ujian
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
