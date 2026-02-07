"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status: string;
  created_at: string;
  roles: string;
  current_belt: string;
  belt_achieved_at: string;
}

interface Belt {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

const beltColors: Record<string, string> = {
  Putih: "bg-gray-100 text-gray-800",
  Kuning: "bg-yellow-100 text-yellow-800",
  "Kuning Strip Hijau": "bg-yellow-100 text-yellow-800",
  Hijau: "bg-green-100 text-green-800",
  "Hijau Strip Biru": "bg-green-100 text-green-800",
  Biru: "bg-blue-100 text-blue-800",
  "Biru Strip Merah": "bg-blue-100 text-blue-800",
  Merah: "bg-red-100 text-red-800",
  "Merah Strip Hitam": "bg-red-100 text-red-800",
  "Merah Strip 2 Hitam": "bg-red-100 text-red-800",
  "Hitam Merah (Poom)": "bg-gray-900 text-white",
  "DAN I": "bg-gray-900 text-white",
  "DAN II": "bg-gray-900 text-white",
  "DAN III": "bg-gray-900 text-white",
  "DAN IV": "bg-gray-900 text-white",
  "DAN V": "bg-gray-900 text-white",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [belts, setBelts] = useState<Belt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBelt, setFilterBelt] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchUsers();
    fetchBelts();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/admin/get/user`);
      const result = await response.json();
      if (result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBelts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/public/get/belt`);
      const result = await response.json();
      if (result.data) {
        setBelts(result.data);
      }
    } catch (error) {
      console.error("Error fetching belts:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBelt =
      filterBelt === "Semua" || user.current_belt === filterBelt;
    const matchStatus =
      filterStatus === "Semua" ||
      user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchBelt && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manajemen User</h1>
        <p className="text-muted-foreground mt-1">
          Kelola semua anggota dojang
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-white border-0 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search
              className="absolute left-3 top-3 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama, email, atau telepon..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Sabuk */}
          <Select
            value={filterBelt}
            onValueChange={(value) => {
              setFilterBelt(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Sabuk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Sabuk</SelectItem>
              {belts.map((belt) => (
                <SelectItem key={belt.id} value={belt.name}>
                  {belt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Status */}
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent flex-1 md:flex-none"
            >
              <Download size={16} />
              Export
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 flex-1 md:flex-none">
              <Plus size={18} />
              Tambah User Baru
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-white border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-center font-semibold text-foreground w-16">
                  No
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Nama
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Sabuk Saat Ini
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Role
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Tanggal Masuk
                </th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Tidak ada data user
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-center text-muted-foreground font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          beltColors[user.current_belt] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.current_belt}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground capitalize">
                      {user.roles}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(user.created_at)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tampilkan:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per halaman</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
