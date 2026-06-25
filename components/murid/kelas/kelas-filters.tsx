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
import { PAGE_SIZE_OPTIONS, type StatusFilter } from "@/types/murid/kelas";

interface KelasFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
}

export function KelasFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  pageSize,
  onPageSizeChange,
}: KelasFiltersProps) {
  return (
    <section
      aria-label="Filter kelas"
      className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div className="relative w-full md:max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama kelas..."
          aria-label="Cari nama kelas"
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status-filter" className="sr-only">
            Filter status kelas
          </label>
          <Select
            value={status}
            onValueChange={(v) => onStatusChange(v as StatusFilter)}
          >
            <SelectTrigger id="status-filter" className="w-full sm:w-[160px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
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
              className="w-full sm:w-[140px]"
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

export function KelasFiltersSkeleton() {
  return (
    <section
      aria-label="Memuat filter"
      className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <Skeleton className="h-9 w-full md:max-w-sm" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-9 w-full sm:w-[160px]" />
        <Skeleton className="h-9 w-full sm:w-[180px]" />
      </div>
    </section>
  );
}
