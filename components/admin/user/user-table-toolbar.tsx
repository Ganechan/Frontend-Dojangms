"use client";

import { useRouter } from "next/navigation";
import { Table } from "@tanstack/react-table";
import {
  IconChevronDown,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

import { User, RoleCounts } from "./hooks/types"; // ✅ Import RoleCounts
import { columnLabelMap } from "./hooks/constants";

interface UserTableToolbarProps {
  table: Table<User>;
  roleCounts?: RoleCounts; // ✅ CHANGED: Optional karena bisa undefined
}

export function UserTableToolbar({ table, roleCounts }: UserTableToolbarProps) {
  // ✅ Default values jika roleCounts undefined
  const counts = roleCounts ?? {
    semua: 0,
    admin: 0,
    pelatih: 0,
    murid: 0,
  };
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 flex">
        <TabsTrigger value="semua">
          Semua <Badge variant="secondary">{counts.semua}</Badge>
        </TabsTrigger>
        <TabsTrigger value="admin">
          Admin <Badge variant="secondary">{counts.admin}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pelatih">
          Pelatih <Badge variant="secondary">{counts.pelatih}</Badge>
        </TabsTrigger>
        <TabsTrigger value="murid">
          Murid <Badge variant="secondary">{counts.murid}</Badge>
        </TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold">
              Tampilkan Kolom
            </div>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabelMap[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/user/add")}
        >
          <IconPlus />
          <span className="hidden lg:inline">Tambah Pengguna</span>
        </Button>
      </div>
    </div>
  );
}
