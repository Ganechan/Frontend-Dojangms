"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/stats-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, User, Calendar, TrendingUp, Target, Zap } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrainingSession {
  id: number;
  coach_name: string;
  date: string;
  time: string;
  location: string;
}

interface Championship {
  id: number;
  name: string;
  date: string;
  registration_status: "registered" | "interested" | "completed";
  result?: string;
}

interface Achievement {
  id: number;
  title: string;
  date: string;
  medal: "gold" | "silver" | "bronze";
}

interface ProgressData {
  month: string;
  score: number;
}

export default function StudentDashboard() {
  const [trainingSchedule, setTrainingSchedule] = useState<TrainingSession[]>(
    [],
  );
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API calls
    setTrainingSchedule([
      {
        id: 1,
        coach_name: "Pak Hendra",
        date: "2026-03-01",
        time: "09:00 - 11:00",
        location: "Gedung Olahraga A",
      },
      {
        id: 2,
        coach_name: "Pak Hendra",
        date: "2026-03-03",
        time: "14:00 - 16:00",
        location: "Gedung Olahraga A",
      },
      {
        id: 3,
        coach_name: "Bu Siti",
        date: "2026-03-05",
        time: "10:00 - 12:00",
        location: "Gedung Olahraga B",
      },
    ]);

    setChampionships([
      {
        id: 1,
        name: "Kejuaraan Nasional 2026",
        date: "2026-03-15",
        registration_status: "registered",
        result: "Pending",
      },
      {
        id: 2,
        name: "Turnamen Regional Jawa Timur",
        date: "2026-04-20",
        registration_status: "interested",
      },
      {
        id: 3,
        name: "Kompetisi Lokal Februari",
        date: "2026-02-28",
        registration_status: "completed",
        result: "Silver Medal",
      },
    ]);

    setAchievements([
      {
        id: 1,
        title: "Silver Medal - Kompetisi Lokal Februari",
        date: "2026-02-28",
        medal: "silver",
      },
      {
        id: 2,
        title: "Best Progress - Training Program",
        date: "2026-02-15",
        medal: "gold",
      },
      {
        id: 3,
        title: "Bronze Medal - Turnamen Mini Bulan Lalu",
        date: "2026-01-20",
        medal: "bronze",
      },
    ]);

    setProgressData([
      { month: "Des", score: 65 },
      { month: "Jan", score: 72 },
      { month: "Feb", score: 85 },
      { month: "Mar", score: 92 },
    ]);

    setLoading(false);
  }, []);

  const nextTraining = trainingSchedule[0];
  const upcomingChampionships = championships.filter(
    (c) => new Date(c.date) > new Date(),
  ).length;
  const totalAchievements = achievements.length;
  const currentScore = progressData[progressData.length - 1]?.score || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Siswa</h1>
          <p className="mt-2 text-gray-600">
            Pantau progress dan prestasi Anda di sini.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Skor Terkini"
            value={currentScore}
            icon={<Target className="h-6 w-6" />}
            description="Peningkatan dari bulan lalu"
            trend={{ value: 27, direction: "up" }}
          />
          <StatsCard
            title="Latihan Mendatang"
            value={trainingSchedule.length}
            icon={<Calendar className="h-6 w-6" />}
            description="Sesi training terjadwal"
          />
          <StatsCard
            title="Total Prestasi"
            value={totalAchievements}
            icon={<Award className="h-6 w-6" />}
            description="Medali dan penghargaan"
          />
          <StatsCard
            title="Kejuaraan Aktif"
            value={upcomingChampionships}
            icon={<Zap className="h-6 w-6" />}
            description="Event yang akan datang"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Training Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Jadwal Latihan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingSchedule.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {session.coach_name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(
                            new Date(session.date),
                            "EEEE, dd MMMM yyyy",
                            {
                              locale: idLocale,
                            },
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          🕐 {session.time}
                        </p>
                        <p className="text-sm text-gray-500">
                          📍 {session.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coach Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Pelatih
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="h-16 w-16 rounded-full bg-gray-300 mx-auto mb-4"></div>
                <p className="font-semibold text-gray-900">Pak Hendra</p>
                <p className="text-sm text-gray-600 mt-1">Pelatih Senior</p>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    hendra@example.com
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telepon</p>
                  <p className="text-sm font-medium text-gray-900">
                    +62 812-3456-7890
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pengalaman</p>
                  <p className="text-sm font-medium text-gray-900">15 tahun</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Pelatihan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value} pts`} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Championships */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Kejuaraan Diikuti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {championships.map((championship) => (
                      <TableRow key={championship.id}>
                        <TableCell className="font-medium">
                          {championship.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(championship.date), "dd MMM", {
                            locale: idLocale,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              championship.registration_status === "registered"
                                ? "default"
                                : championship.registration_status ===
                                    "interested"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {championship.registration_status === "registered"
                              ? "Terdaftar"
                              : championship.registration_status ===
                                  "interested"
                                ? "Tertarik"
                                : "Selesai"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Prestasi & Penghargaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 pb-4 border-b last:border-b-0"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 text-lg ${
                      achievement.medal === "gold"
                        ? "bg-yellow-100"
                        : achievement.medal === "silver"
                          ? "bg-gray-100"
                          : "bg-orange-100"
                    }`}
                  >
                    {achievement.medal === "gold"
                      ? "🥇"
                      : achievement.medal === "silver"
                        ? "🥈"
                        : "🥉"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(achievement.date), "dd MMMM yyyy", {
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
