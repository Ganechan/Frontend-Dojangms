// app\admin\page.tsx
'use client';


import React from "react"

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Trophy, UserPlus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const memberGrowthData = [
  { month: 'Jan', members: 150 },
  { month: 'Feb', members: 180 },
  { month: 'Mar', members: 220 },
  { month: 'Apr', members: 250 },
  { month: 'May', members: 290 },
  { month: 'Jun', members: 340 },
];

const beltDistributionData = [
  { belt: 'White', count: 80 },
  { belt: 'Yellow', count: 65 },
  { belt: 'Orange', count: 55 },
  { belt: 'Green', count: 48 },
  { belt: 'Blue', count: 42 },
  { belt: 'Red', count: 35 },
  { belt: 'Black', count: 15 },
];

const ageDistributionData = [
  { name: 'Anak (5-12)', value: 120 },
  { name: 'Remaja (13-18)', value: 145 },
  { name: 'Dewasa (19+)', value: 75 },
];

const COLORS = ['#3B82F6', '#F59E0B', '#EF4444'];

const recentActivities = [
  { id: 1, date: '2024-01-15', activity: 'Pendaftaran Anggota Baru', user: 'Ahmad Ridho', status: 'Sukses' },
  { id: 2, date: '2024-01-14', activity: 'Ujian Sabuk Yellow', user: 'Siti Nurhaliza', status: 'Lulus' },
  { id: 3, date: '2024-01-13', activity: 'Pendaftaran Kejuaraan', user: 'Budi Santoso', status: 'Menunggu' },
  { id: 4, date: '2024-01-12', activity: 'Ujian Sabuk Green', user: 'Dewi Lestari', status: 'Lulus' },
  { id: 5, date: '2024-01-11', activity: 'Pendaftaran Anggota Baru', user: 'Rian Pratama', status: 'Sukses' },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  bgColor,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ size: number }>;
  trend: 'up' | 'down';
  trendValue: number;
  bgColor: string;
}) => (
  <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <div className="flex items-center gap-1 mt-3">
          {trend === 'up' ? (
            <TrendingUp size={16} className="text-green-600" />
          ) : (
            <TrendingDown size={16} className="text-red-600" />
          )}
          <span className={trend === 'up' ? 'text-green-600 text-sm font-semibold' : 'text-red-600 text-sm font-semibold'}>
            {trendValue}%
          </span>
        </div>
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon size={24} />
      </div>
    </div>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang kembali, Admin</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Anggota Aktif"
          value={340}
          icon={Users}
          trend="up"
          trendValue={12}
          bgColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Kejuaraan"
          value={24}
          icon={Trophy}
          trend="up"
          trendValue={8}
          bgColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Anggota Baru (Bulan Ini)"
          value={28}
          icon={UserPlus}
          trend="up"
          trendValue={15}
          bgColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Kejuaraan Mendatang"
          value={5}
          icon={Calendar}
          trend="down"
          trendValue={2}
          bgColor="bg-red-100 text-red-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2 p-6 bg-white border-0 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pertumbuhan Anggota (6 Bulan Terakhir)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memberGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="members"
                stroke="#DC2626"
                strokeWidth={3}
                dot={{ fill: '#DC2626', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Distribusi Usia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ageDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ageDistributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="p-6 bg-white border-0 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Distribusi Anggota per Tingkat Sabuk</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={beltDistributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="belt" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" fill="#DC2626" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities Table */}
        <Card className="lg:col-span-2 p-6 bg-white border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Aktivitas Terbaru</h3>
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Aktivitas</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">{activity.date}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{activity.activity}</td>
                    <td className="py-3 px-4 text-foreground">{activity.user}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === 'Sukses'
                            ? 'bg-green-100 text-green-800'
                            : activity.status === 'Lulus'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
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
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Aksi Cepat</h3>
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
        </Card>
      </div>
    </div>
  );
}
