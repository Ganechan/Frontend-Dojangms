"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Championship {
  id: number;
  name: string;
  date: string;
  location: string;
  status: "Mendatang" | "Berlangsung" | "Selesai";
  participants: number;
  image?: string;
}

const championships: Championship[] = [
  {
    id: 1,
    name: "Kejuaraan Poomsae Nasional 2024",
    date: "2024-03-15",
    location: "Jakarta Convention Center",
    status: "Mendatang",
    participants: 45,
  },
  {
    id: 2,
    name: "Kompetisi Kyorugi Regional",
    date: "2024-02-20",
    location: "Salatiga Sports Arena",
    status: "Mendatang",
    participants: 32,
  },
  {
    id: 3,
    name: "Tournament Breaking & Sparring",
    date: "2024-01-28",
    location: "Bandung Convention Hall",
    status: "Berlangsung",
    participants: 28,
  },
  {
    id: 4,
    name: "Taekwondo Challenge Cup 2023",
    date: "2023-12-10",
    location: "Yogyakarta Sports Center",
    status: "Selesai",
    participants: 56,
  },
  {
    id: 5,
    name: "Kejuaraan Sabuk Putih - Kuning",
    date: "2023-11-15",
    location: "Salatiga Sports Arena",
    status: "Selesai",
    participants: 38,
  },
];

export default function ChampionshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredChampionships = championships.filter((champ) => {
    const matchSearch =
      champ.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      champ.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "Semua" || champ.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Mendatang":
        return "bg-blue-100 text-blue-800";
      case "Berlangsung":
        return "bg-yellow-100 text-yellow-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Manajemen Kejuaraan
        </h1>
        <p className="text-muted-foreground mt-1">
          Kelola semua kejuaraan dan turnamen
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-white border-0 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search
              className="absolute left-3 top-3 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama kejuaraan atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option>Semua Status</option>
              <option>Mendatang</option>
              <option>Berlangsung</option>
              <option>Selesai</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Tabel
            </button>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full md:w-auto">
            <Plus size={18} />
            Buat Kejuaraan Baru
          </Button>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChampionships.map((champ) => (
            <Card
              key={champ.id}
              className="bg-white border-0 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="text-primary/50">
                  <Calendar size={48} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                    {champ.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {champ.location}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    {champ.date}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(champ.status)}`}
                  >
                    {champ.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground py-2 border-t border-border">
                  <Users size={16} className="text-primary" />
                  <span>{champ.participants} peserta terdaftar</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                  >
                    <Eye size={16} />
                    Detail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-destructive">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="bg-white border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Nama Kejuaraan
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Peserta
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredChampionships.map((champ) => (
                  <tr
                    key={champ.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {champ.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {champ.date}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {champ.location}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(champ.status)}`}
                      >
                        {champ.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">
                      {champ.participants}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground hover:text-primary">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground hover:text-primary">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-destructive">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredChampionships.length === 0 && (
        <Card className="p-12 bg-white border-0 shadow-sm text-center">
          <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Tidak ada kejuaraan
          </h3>
          <p className="text-muted-foreground">
            Coba ubah filter atau buat kejuaraan baru
          </p>
        </Card>
      )}
    </div>
  );
}
