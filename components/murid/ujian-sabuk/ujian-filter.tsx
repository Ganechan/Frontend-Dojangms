// components\murid\ujian-sabuk\ujian-filter.tsx
"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE_OPTIONS, STATUS_OPTIONS } from "@/types/murid/ujian-sabuk";

interface UjianFiltersProps {
  status: string;
  perPage: number;
  onStatusChange: (value: string) => void;
  onPerPageChange: (value: number) => void;
}

export function UjianFilters({
  status,
  perPage,
  onStatusChange,
  onPerPageChange,
}: UjianFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-col gap-1.5 sm:w-44">
        <Label htmlFor="filter-status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="filter-status" className="h-9 w-full">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Status</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-32">
        <Label htmlFor="filter-tampilkan">Tampilkan</Label>
        <Select
          value={String(perPage)}
          onValueChange={(value) => onPerPageChange(Number(value))}
        >
          <SelectTrigger id="filter-tampilkan" className="h-9 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function UjianFiltersSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-1.5 sm:w-44">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col gap-1.5 sm:w-32">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
