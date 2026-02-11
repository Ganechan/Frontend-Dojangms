"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import {
  useChampionship,
  Championship,
  LEVEL_OPTIONS,
  LEVEL_COLORS,
} from "../../../components/admin/kejuaraan/hooks/useChampionship";
import { ChampionshipFormDialog } from "../../../components/admin/kejuaraan/Championshipformdialog";
import { ChampionshipDeleteDialog } from "../../../components/admin/kejuaraan/Championshipdeletedialog";

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: localeId });
  } catch {
    return dateString;
  }
};

export default function ChampionshipTable() {
  const {
    filteredChampionships,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedChampionship,
    isSubmitting,
    formData,
    setFormData,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleDetailClick,
    handleSaveChampionship,
    handleConfirmDelete,
  } = useChampionship();

  const totalPages = Math.ceil(filteredChampionships.length / itemsPerPage);
  const paginatedData = filteredChampionships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Kelola Kejuaraan</h1>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah Kejuaraan
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Cari kejuaraan..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      {/* Content */}
      <Card className="border border-gray-200">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredChampionships.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead className="text-center">Nama</TableHead>
                    <TableHead className="text-center">Level</TableHead>
                    <TableHead className="text-center">Lokasi</TableHead>
                    <TableHead className="text-center">Tanggal Mulai</TableHead>
                    <TableHead className="text-center">Tanggal Akhir</TableHead>
                    <TableHead className="w-24 text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((championship, index) => (
                    <ChampionshipRow
                      key={championship.id}
                      championship={championship}
                      index={(currentPage - 1) * itemsPerPage + index + 1}
                      onDetail={handleDetailClick}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(val) => {
                setItemsPerPage(val);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </Card>

      <ChampionshipFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedChampionship={selectedChampionship}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveChampionship}
        isSubmitting={isSubmitting}
      />

      <ChampionshipDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedChampionship={selectedChampionship}
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full bg-gray-300" />
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-6 text-center space-y-2">
      <p className="text-red-600 font-medium">Error</p>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="p-6">
      <Empty
        title="Tidak ada kejuaraan"
        description={
          searchQuery
            ? "Tidak ada kejuaraan yang sesuai dengan pencarian Anda"
            : 'Belum ada data kejuaraan. Klik tombol "Tambah Kejuaraan" untuk membuat yang baru.'
        }
      />
    </div>
  );
}

function ChampionshipRow({
  championship,
  index,
  onDetail,
  onEdit,
  onDelete,
}: {
  championship: Championship;
  index: number;
  onDetail: (c: Championship) => void;
  onEdit: (c: Championship) => void;
  onDelete: (c: Championship) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium text-center">{index}</TableCell>
      <TableCell className="max-w-xs break-words whitespace-normal">
        {championship.name}
      </TableCell>
      <TableCell className="text-center">
        <Badge className={LEVEL_COLORS[championship.level]}>
          {LEVEL_OPTIONS.find((opt) => opt.value === championship.level)?.label}
        </Badge>
      </TableCell>
      <TableCell>{championship.location}</TableCell>
      <TableCell>{formatDate(championship.start_date)}</TableCell>
      <TableCell>{formatDate(championship.end_date)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDetail(championship)}
          >
            <Eye className="w-4 h-4" />
            <span className="sr-only">Detail</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(championship)}
          >
            <Edit2 className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(championship)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
