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

import type { User, StatusCounts } from "./hooks/types";
import { columnLabelMap } from "./hooks/constants";

interface UserTableToolbarProps {
  table: Table<User>;
  statusCounts?: StatusCounts;
}

export function UserTableToolbar({
  table,
  statusCounts,
}: UserTableToolbarProps) {
  const counts = statusCounts ?? { total: 0, active: 0, inactive: 0 };
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 flex">
        <TabsTrigger value="total">
          Total <Badge variant="secondary">{counts.total}</Badge>
        </TabsTrigger>
        <TabsTrigger value="active">
          Active <Badge variant="secondary">{counts.active}</Badge>
        </TabsTrigger>
        <TabsTrigger value="inactive">
          Inactive <Badge variant="secondary">{counts.inactive}</Badge>
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
