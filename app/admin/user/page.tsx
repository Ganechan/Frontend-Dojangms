"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronDown,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  belt: string;
  category: string;
  status: "Aktif" | "Tidak Aktif";
  joinDate: string;
  avatar?: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Ahmad Ridho",
    email: "ahmad@example.com",
    phone: "081234567890",
    belt: "Black",
    category: "Dewasa",
    status: "Aktif",
    joinDate: "2022-05-15",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    phone: "081234567891",
    belt: "Yellow",
    category: "Anak",
    status: "Aktif",
    joinDate: "2023-08-20",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567892",
    belt: "Green",
    category: "Remaja",
    status: "Aktif",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    phone: "081234567893",
    belt: "Blue",
    category: "Dewasa",
    status: "Tidak Aktif",
    joinDate: "2022-11-05",
  },
  {
    id: 5,
    name: "Rian Pratama",
    email: "rian@example.com",
    phone: "081234567894",
    belt: "Orange",
    category: "Anak",
    status: "Aktif",
    joinDate: "2024-01-12",
  },
];

const beltColors: Record<string, string> = {
  White: "bg-gray-100 text-gray-800",
  Yellow: "bg-yellow-100 text-yellow-800",
  Orange: "bg-orange-100 text-orange-800",
  Green: "bg-green-100 text-green-800",
  Blue: "bg-blue-100 text-blue-800",
  Red: "bg-red-100 text-red-800",
  Black: "bg-gray-900 text-white",
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBelt, setFilterBelt] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBelt = filterBelt === "Semua" || user.belt === filterBelt;
    const matchStatus =
      filterStatus === "Semua" || user.status === filterStatus;
    return matchSearch && matchBelt && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    }
  };

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
              placeholder="Cari nama, email, atau sabuk..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Sabuk */}
          <div>
            <select
              value={filterBelt}
              onChange={(e) => {
                setFilterBelt(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option>Semua Sabuk</option>
              <option>White</option>
              <option>Yellow</option>
              <option>Orange</option>
              <option>Green</option>
              <option>Blue</option>
              <option>Red</option>
              <option>Black</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Tidak Aktif</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedUsers.length === 0}
              className="gap-2 bg-transparent"
            >
              <Trash2 size={16} />
              Hapus Terpilih
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download size={16} />
              Export
            </Button>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full md:w-auto">
            <Plus size={18} />
            Tambah User Baru
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-white border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={
                      paginatedUsers.length > 0 &&
                      paginatedUsers.every((u) => selectedUsers.includes(u.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Nama
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Telepon
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Sabuk
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Bergabung
                </th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) =>
                        handleSelectUser(user.id, e.target.checked)
                      }
                      className="rounded border-border cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        beltColors[user.belt] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.belt}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground">{user.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.joinDate}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
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
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
