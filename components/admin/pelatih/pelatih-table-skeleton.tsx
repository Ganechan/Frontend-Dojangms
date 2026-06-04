import { Skeleton } from "@/components/ui/skeleton";

export function PelatihTableSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Toolbar skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[280px] rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="flex gap-4 bg-muted px-4 py-3">
          {[140, 180, 100, 120, 60, 60, 80, 60].map((w, i) => (
            <Skeleton key={i} style={{ width: w }} className="h-4 rounded" />
          ))}
        </div>

        {/* Rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 border-t items-center">
            <div className="flex flex-col gap-1" style={{ width: 140 }}>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
            {[180, 100, 120, 60, 60].map((w, j) => (
              <Skeleton key={j} style={{ width: w }} className="h-4 rounded" />
            ))}
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-md ml-auto" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-9 w-[90px] rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
