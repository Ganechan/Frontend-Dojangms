import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { HARI_OPTIONS, type HariFilter } from "@/types/murid/jadwal";
import { PAGE_SIZE_OPTIONS } from "@/types/murid/kelas";
import type { StatusFilter } from "@/types/murid/kelas";

interface JadwalFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  hari: HariFilter;
  onHariChange: (value: HariFilter) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
}

export function JadwalFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  hari,
  onHariChange,
  pageSize,
  onPageSizeChange,
}: JadwalFiltersProps) {
  return (
    <section
      aria-label="Filter jadwal"
      className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="relative w-full lg:max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama jadwal atau kelas..."
          aria-label="Cari nama jadwal atau kelas"
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status-filter" className="sr-only">
            Filter status jadwal
          </label>
          <Select
            value={status}
            onValueChange={(v) => onStatusChange(v as StatusFilter)}
          >
            <SelectTrigger id="status-filter" className="w-full lg:w-[150px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="hari-filter" className="sr-only">
            Filter hari
          </label>
          <Select
            value={hari}
            onValueChange={(v) => onHariChange(v as HariFilter)}
          >
            <SelectTrigger id="hari-filter" className="w-full lg:w-[150px]">
              <SelectValue placeholder="Semua Hari" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Hari</SelectItem>
              {HARI_OPTIONS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground">
            Tampilkan
          </span>
          <label htmlFor="page-size-filter" className="sr-only">
            Jumlah data per halaman
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger
              id="page-size-filter"
              className="w-full lg:w-[130px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} data
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}

export function JadwalFiltersSkeleton() {
  return (
    <section
      aria-label="Memuat filter"
      className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
    >
      <Skeleton className="h-9 w-full lg:max-w-sm" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
        <Skeleton className="h-9 w-full lg:w-[150px]" />
        <Skeleton className="h-9 w-full lg:w-[150px]" />
        <Skeleton className="h-9 w-full lg:w-[200px]" />
      </div>
    </section>
  );
}
