"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  HASIL_OPTIONS,
  LEVEL_OPTIONS,
  PAGE_SIZE_OPTIONS,
  buildYearOptions,
} from "@/types/murid/prestasi"

interface PrestasiFiltersProps {
  search: string
  tahun: string
  level: string
  hasil: string
  perPage: number
  onSearchChange: (value: string) => void
  onTahunChange: (value: string) => void
  onLevelChange: (value: string) => void
  onHasilChange: (value: string) => void
  onPerPageChange: (value: number) => void
}

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function PrestasiFilters({
  search,
  tahun,
  level,
  hasil,
  perPage,
  onSearchChange,
  onTahunChange,
  onLevelChange,
  onHasilChange,
  onPerPageChange,
}: PrestasiFiltersProps) {
  const years = buildYearOptions()

  return (
    <section
      aria-label="Pencarian dan filter"
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="flex w-full flex-col gap-1.5 lg:max-w-sm">
        <label htmlFor="cari-kejuaraan" className="text-xs font-medium text-muted-foreground">
          Pencarian
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="cari-kejuaraan"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama kejuaraan..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-end">
        <FilterField label="Tahun" htmlFor="filter-tahun">
          <Select value={tahun} onValueChange={onTahunChange}>
            <SelectTrigger id="filter-tahun" className="h-9 w-full lg:w-32">
              <SelectValue placeholder="Semua Tahun">
                {(value: string) => (value === "all" ? "Semua Tahun" : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Level" htmlFor="filter-level">
          <Select value={level} onValueChange={onLevelChange}>
            <SelectTrigger id="filter-level" className="h-9 w-full lg:w-40">
              <SelectValue placeholder="Semua Level">
                {(value: string) => (value === "all" ? "Semua Level" : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua Level</SelectItem>
                {LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Hasil" htmlFor="filter-hasil">
          <Select value={hasil} onValueChange={onHasilChange}>
            <SelectTrigger id="filter-hasil" className="h-9 w-full lg:w-36">
              <SelectValue placeholder="Semua Hasil">
                {(value: string) => (value === "all" ? "Semua Hasil" : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua Hasil</SelectItem>
                {HASIL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Tampilkan" htmlFor="filter-tampilkan">
          <Select
            value={String(perPage)}
            onValueChange={(value) => onPerPageChange(Number(value))}
          >
            <SelectTrigger id="filter-tampilkan" className="h-9 w-full lg:w-24">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FilterField>
      </div>
    </section>
  )
}

export function PrestasiFiltersSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <Skeleton className="h-9 w-full lg:max-w-sm" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
        <Skeleton className="h-9 w-full lg:w-32" />
        <Skeleton className="h-9 w-full lg:w-40" />
        <Skeleton className="h-9 w-full lg:w-36" />
        <Skeleton className="h-9 w-full lg:w-24" />
      </div>
    </section>
  )
}
