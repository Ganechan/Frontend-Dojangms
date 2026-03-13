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
import { Users, Trophy, Calendar, Zap, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Student {
  id: number;
  name: string;
  level: string;
  achievement_count: number;
  recent_achievement?: string;
}

interface Championship {
  id: number;
  name: string;
  date: string;
  participant_count: number;
  location: string;
}

interface Achievement {
  id: number;
  student_name: string;
  achievement: string;
  date: string;
  level: string;
}

export default function CoachDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [upcomingChampionships, setUpcomingChampionships] = useState<
    Championship[]
  >([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API calls
    setStudents([
      {
        id: 1,
        name: "Ahmad Riyanto",
        level: "Intermediate",
        achievement_count: 5,
        recent_achievement: "Gold Medal - Regional Championship",
      },
      {
        id: 2,
        name: "Siti Nur Azizah",
        level: "Beginner",
        achievement_count: 2,
        recent_achievement: "Participant - Local Competition",
      },
      {
        id: 3,
        name: "Budi Santoso",
        level: "Advanced",
        achievement_count: 8,
        recent_achievement: "Gold Medal - National Championship",
      },
      {
        id: 4,
        name: "Rini Wijaya",
        level: "Beginner",
        achievement_count: 1,
        recent_achievement: "Participant - Training Session",
      },
    ]);

    setUpcomingChampionships([
      {
        id: 1,
        name: "Kejuaraan Nasional 2026",
        date: "2026-03-15",
        participant_count: 3,
        location: "Jakarta",
      },
      {
        id: 2,
        name: "Turnamen Regional Jawa Timur",
        date: "2026-04-20",
        participant_count: 2,
        location: "Surabaya",
      },
    ]);

    setRecentAchievements([
      {
        id: 1,
        student_name: "Budi Santoso",
        achievement: "Gold Medal - National Championship",
        date: "2026-02-20",
        level: "Gold",
      },
      {
        id: 2,
        student_name: "Ahmad Riyanto",
        achievement: "Silver Medal - Regional Championship",
        date: "2026-02-15",
        level: "Silver",
      },
      {
        id: 3,
        student_name: "Siti Nur Azizah",
        achievement: "Participant - Local Competition",
        date: "2026-02-10",
        level: "Bronze",
      },
    ]);

    setLoading(false);
  }, []);

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.level !== "Beginner").length;
  const totalAchievements = students.reduce(
    (acc, s) => acc + s.achievement_count,
    0,
  );

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
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Pelatih
          </h1>
          <p className="mt-2 text-gray-600">
            Selamat datang kembali! Berikut ringkasan aktivitas Anda.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Murid"
            value={totalStudents}
            icon={<Users className="h-6 w-6" />}
            description="Murid yang dibimbing"
            trend={{ value: 12, direction: "up" }}
          />
          <StatsCard
            title="Murid Aktif"
            value={activeStudents}
            icon={<Zap className="h-6 w-6" />}
            description="Tingkat intermediate & advanced"
          />
          <StatsCard
            title="Total Prestasi"
            value={totalAchievements}
            icon={<Trophy className="h-6 w-6" />}
            description="Pencapaian murid"
            trend={{ value: 25, direction: "up" }}
          />
          <StatsCard
            title="Kejuaraan Mendatang"
            value={upcomingChampionships.length}
            icon={<Calendar className="h-6 w-6" />}
            description="Event yang dikelola"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Murid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Prestasi</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.level === "Advanced"
                                  ? "default"
                                  : student.level === "Intermediate"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {student.level}
                            </Badge>
                          </TableCell>
                          <TableCell>{student.achievement_count}</TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {student.recent_achievement}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Championships */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Kejuaraan Mendatang
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingChampionships.map((championship) => (
                  <div
                    key={championship.id}
                    className="border-l-4 border-blue-500 pl-4 pb-4 border-b"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {championship.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(championship.date), "dd MMMM yyyy", {
                        locale: idLocale,
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {championship.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Peserta: {championship.participant_count} murid
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Achievements */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prestasi Terbaru Murid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start justify-between pb-4 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {achievement.student_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {achievement.achievement}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(achievement.date), "dd MMM yyyy", {
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      achievement.level === "Gold"
                        ? "default"
                        : achievement.level === "Silver"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {achievement.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
