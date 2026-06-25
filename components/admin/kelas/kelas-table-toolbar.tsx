"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type {
  Kelas,
  ActiveKelasTab,
  KelasStatusCounts,
} from "@/types/admin/kelas";

interface KelasTableToolbarProps {
  table: Table<Kelas>;
  statusCounts?: KelasStatusCounts;
  onSearchChange?: (q: string) => void;
  onStatusChange?: (status: ActiveKelasTab) => void;
  initialSearch?: string;
  initialStatus?: ActiveKelasTab;
  isLoading?: boolean;
}

const TABS: { value: ActiveKelasTab; label: string }[] = [
  { value: "total", label: "Total" },
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Tidak Aktif" },
];

export function KelasTableToolbar({
  table,
  statusCounts,
  onSearchChange,
  onStatusChange,
  initialSearch,
  isLoading = false,
}: KelasTableToolbarProps) {
  const [q, setQ] = React.useState(initialSearch ?? "");

  React.useEffect(() => {
    setQ(initialSearch ?? "");
  }, [initialSearch]);

  const applySearch = () => onSearchChange?.(q.trim());

  const clear = () => {
    setQ("");
    onSearchChange?.("");
    onStatusChange?.("total");
    table.resetColumnFilters();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applySearch();
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="w-full sm:w-auto">
          {TABS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-2"
              onClick={() => onStatusChange?.(value)}
              disabled={isLoading}
            >
              {label}
              {typeof statusCounts?.[value] === "number" && (
                <span className="text-xs text-muted-foreground">
                  ({statusCounts[value]})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari nama kelas..."
            className="sm:w-[280px]"
            disabled={isLoading}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={applySearch}
              disabled={isLoading}
            >
              Cari
            </Button>
            <Button variant="ghost" onClick={clear} disabled={isLoading}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
