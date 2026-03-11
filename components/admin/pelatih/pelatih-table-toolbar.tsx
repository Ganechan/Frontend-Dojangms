"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import type { ActiveStatusTab, CoachData, CoachStatusCounts } from "@/types/pelatih";

interface CoachTableToolbarProps {
  table: Table<CoachData>;
  statusCounts?: CoachStatusCounts;
  onSearchChange?: (q: string) => void;
  onStatusChange?: (status: string) => void;
  initialSearch?: string;
  initialStatus?: ActiveStatusTab;
}

export function CoachTableToolbar({
  table,
  statusCounts,
  onSearchChange,
  onStatusChange,
  initialSearch,
  initialStatus,
}: CoachTableToolbarProps) {
  const [q, setQ] = React.useState(initialSearch ?? "");

  // sync jika initialSearch berubah dari URL (misal user klik back)
  React.useEffect(() => {
    setQ(initialSearch ?? "");
  }, [initialSearch]);

  const applySearch = () => onSearchChange?.(q);

  const clear = () => {
    setQ("");
    onSearchChange?.("");
    table.resetColumnFilters();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applySearch();
  };

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="w-full sm:w-auto">
          {(["total", "active", "inactive"] as ActiveStatusTab[]).map((s) => {
            const labels: Record<ActiveStatusTab, string> = {
              total: "Total",
              active: "Aktif",
              inactive: "Tidak Aktif"
            };
            const count = statusCounts?.[s];

            return (
              <TabsTrigger key={s} value={s} className="gap-2" onClick={() => onStatusChange?.(s)}>
                {labels[s]}
                {typeof count === "number" && (
                  <span className="text-xs text-muted-foreground">
                    ({count})
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari nama / email..."
            className="sm:w-[280px]"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={applySearch}>
              Cari
            </Button>
            <Button variant="ghost" onClick={clear}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
