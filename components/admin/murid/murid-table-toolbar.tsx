"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type {
  ActiveStatusTab,
  MuridData,
  MuridStatusCounts,
} from "@/types/admin/murid";

interface MuridTableToolbarProps {
  table: Table<MuridData>;
  statusCounts?: MuridStatusCounts;
  onSearchChange?: (q: string) => void;
  onStatusChange?: (status: ActiveStatusTab) => void;
  initialSearch?: string;
  initialStatus?: ActiveStatusTab;
}

const TABS: { value: ActiveStatusTab; label: string }[] = [
  { value: "total", label: "Total" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" },
];

export function MuridTableToolbar({
  table,
  statusCounts,
  onSearchChange,
  onStatusChange,
  initialSearch,
}: MuridTableToolbarProps) {
  const [q, setQ] = React.useState(initialSearch ?? "");

  React.useEffect(() => {
    setQ(initialSearch ?? "");
  }, [initialSearch]);

  const applySearch = () => onSearchChange?.(q.trim());

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
          {TABS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-2"
              onClick={() => onStatusChange?.(value)}
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
