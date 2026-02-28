"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Championship {
  id: number;
  name: string;
  level: string;
  location: string;
  start_date: string;
  end_date: string;
  status: "akan datang" | "berlangsung" | "selesai";
}

interface ChampionshipTableProps {
  data: Championship[];
  totalItems: number;
  currentPage: number;
  limit: number;
  onAddClick: () => void;
  onEditClick: (championship: Championship) => void;
  onDeleteClick: (id: number) => void;
  selectedStatus: string | null;
  onStatusFilterChange: (status: string | null) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const statusColors = {
  "akan datang": "bg-blue-100 text-blue-800",
  berlangsung: "bg-green-100 text-green-800",
  selesai: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  "akan datang": "Akan Datang",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};

const levelLabels: Record<string, string> = {
  internasional: "Internasional",
  nasional: "Nasional",
  provinsi: "Provinsi",
  kota: "Kota",
};

const LIMIT_OPTIONS = [10, 25, 50, 75, 100, 200];

export function ChampionshipTable({
  data,
  totalItems,
  currentPage,
  limit,
  onAddClick,
  onEditClick,
  onDeleteClick,
  selectedStatus,
  onStatusFilterChange,
  onPageChange,
  onLimitChange,
}: ChampionshipTableProps) {
  const filteredData = selectedStatus
    ? data.filter((item) => item.status === selectedStatus)
    : data;

  const totalPages = Math.ceil(totalItems / limit);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => onStatusFilterChange(null)}
                    >
                      {selectedStatus === null ? "✓ " : ""}Semua
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusFilterChange("akan datang")}
                    >
                      {selectedStatus === "akan datang" ? "✓ " : ""}Akan Datang
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusFilterChange("berlangsung")}
                    >
                      {selectedStatus === "berlangsung" ? "✓ " : ""}Berlangsung
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusFilterChange("selesai")}
                    >
                      {selectedStatus === "selesai" ? "✓ " : ""}Selesai
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                Filter kejuaraan berdasarkan status
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button onClick={onAddClick} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Data
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Kejuaraan</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((championship, index) => (
                <TableRow key={championship.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {championship.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {levelLabels[championship.level] || championship.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{championship.location}</TableCell>
                  <TableCell>
                    {format(new Date(championship.start_date), "dd MMM yyyy", {
                      locale: idLocale,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(championship.end_date), "dd MMM yyyy", {
                      locale: idLocale,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[championship.status]}>
                      {statusLabels[championship.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEditClick(championship)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteClick(championship.id)}
                          className="text-red-600"
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  Tidak ada data kejuaraan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Menampilkan {startItem} - {endItem} dari {totalItems} kejuaraan
        </div>

        <div className="flex items-center gap-4">
          {/* Limit Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Per halaman:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {limit}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LIMIT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => {
                      onLimitChange(option);
                      onPageChange(1);
                    }}
                    className={limit === option ? "bg-gray-100" : ""}
                  >
                    {option === limit ? "✓ " : ""}
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-gray-600 min-w-fit">
              Halaman {currentPage} dari {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
