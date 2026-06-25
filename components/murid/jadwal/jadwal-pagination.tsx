import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JadwalPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, totalPages: number): number[] {
  const maxButtons = 5;
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  let start = Math.max(1, current - 2);
  const end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function JadwalPagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
}: JadwalPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex flex-col items-center gap-4 md:flex-row md:justify-between"
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Menampilkan {from} - {to} dari {total} jadwal
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={isFirst}
          aria-label="Halaman pertama"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirst}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((num) => (
          <Button
            key={num}
            variant={num === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(num)}
            aria-label={`Halaman ${num}`}
            aria-current={num === page ? "page" : undefined}
            className={cn(
              "tabular-nums",
              num === page && "pointer-events-none",
            )}
          >
            {num}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={isLast}
          aria-label="Halaman terakhir"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

export function JadwalPaginationSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
      <Skeleton className="h-5 w-48" />
      <div className="flex items-center gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9" />
        ))}
      </div>
    </div>
  );
}
