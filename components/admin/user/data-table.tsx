"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  tanggal_lahir: z.string(),
  status: z.enum(["active", "inactive"]),
  created_at: z.string(),
  roles: z.string(),
  current_belt: z.string(),
  belt_achieved_at: z.string(),
});

export type User = z.infer<typeof schema>;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const beltColorMap: Record<string, string> = {
  Putih: "bg-white text-gray-800 border border-gray-300",
  Kuning: "bg-yellow-400 text-yellow-900",
  "Kuning Strip Hijau": "bg-yellow-400 text-yellow-900",
  Hijau: "bg-green-500 text-white",
  "Hijau Strip Biru": "bg-green-500 text-white",
  Biru: "bg-blue-600 text-white",
  "Biru Strip Merah": "bg-blue-600 text-white",
  Merah: "bg-red-600 text-white",
  "DAN I": "bg-gray-900 text-white",
  "DAN II": "bg-gray-900 text-white",
  "DAN III": "bg-gray-900 text-white",
  "DAN IV": "bg-gray-900 text-white",
};

function BeltBadge({ belt }: { belt: string }) {
  const cls = beltColorMap[belt] ?? "bg-gray-200 text-gray-800";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {belt}
    </span>
  );
}

function UserDetailDrawer({ user }: { user: User }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          Lihat Detail
        </Button>
      </DrawerTrigger>
      <DrawerContent className={isMobile ? "max-h-[85vh]" : "w-full max-w-md"}>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="break-words">Detail Pengguna</DrawerTitle>
          <DrawerDescription className="break-words">
            Informasi lengkap tentang {user.name}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4">
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-3">
              <Label className="text-muted-foreground text-xs">
                Nama Lengkap
              </Label>
              <div className="break-words text-lg font-semibold">
                {user.name}
              </div>
            </div>

            <Separator />

            {/* Role */}
            <div className="flex flex-col gap-3">
              <Label className="text-muted-foreground text-xs">Role</Label>
              <div className="flex flex-wrap gap-1">
                {user.roles ? (
                  user.roles.split(",").map((r) => (
                    <Badge
                      key={r.trim()}
                      variant="outline"
                      className="text-sm capitalize"
                    >
                      {r.trim()}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-sm">
                    Tidak ada role
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Sabuk Saat Ini */}
            <div className="flex flex-col gap-3">
              <Label className="text-muted-foreground text-xs">
                Sabuk Saat Ini
              </Label>
              <div>
                <BeltBadge belt={user.current_belt || "Putih"} />
              </div>
            </div>

            <Separator />

            {/* Email dan No. Telepon - FULL WIDTH PER ROW */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-xs">Email</Label>
                <div className="break-all text-sm">{user.email}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  No. Telepon
                </Label>
                <div className="break-words text-sm">{user.phone}</div>
              </div>
            </div>

            <Separator />

            {/* Tanggal Lahir dan Status */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  Tanggal Lahir
                </Label>
                <div className="break-words text-sm">
                  {formatDate(user.tanggal_lahir)}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">Status</Label>
                <div>
                  <Badge
                    variant="outline"
                    className={`gap-1 px-2 text-xs ${user.status === "active" ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400" : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"}`}
                  >
                    {user.status === "active" ? (
                      <IconCircleCheckFilled className="size-3 fill-green-500 dark:fill-green-400" />
                    ) : (
                      <IconLoader className="size-3 text-red-500" />
                    )}
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Sabuk Dicapai dan Terdaftar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  Sabuk Dicapai
                </Label>
                <div className="break-words text-sm">
                  {formatDate(user.belt_achieved_at)}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="text-muted-foreground text-xs">
                  Terdaftar
                </Label>
                <div className="break-words text-sm">
                  {formatDate(user.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={() => toast.info(`Edit User: ${user.name}`)}>
            Edit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Tutup</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// DEFINISI SEMUA KOLOM (Termasuk yang hidden by default)
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center">Nama</div>,
    cell: ({ row }) => (
      <div className="font-medium text-left">{row.original.name}</div>
    ),
    enableHiding: false, // Kolom Nama tidak bisa di-hide
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-muted-foreground text-sm">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-center">No. Telepon</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm">{row.original.phone}</span>
      </div>
    ),
  },
  {
    accessorKey: "tanggal_lahir",
    header: () => <div className="text-center">Tanggal Lahir</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm">
          {formatDate(row.original.tanggal_lahir)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "roles",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {row.original.roles ? (
          row.original.roles.split(",").map((r) => (
            <Badge
              key={r.trim()}
              variant="outline"
              className="text-xs capitalize"
            >
              {r.trim()}
            </Badge>
          ))
        ) : (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            -
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "current_belt",
    header: () => <div className="text-center">Sabuk</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <BeltBadge belt={row.original.current_belt || "Putih"} />
      </div>
    ),
  },
  {
    accessorKey: "belt_achieved_at",
    header: () => <div className="text-center">Sabuk Dicapai</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.belt_achieved_at)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const isActive = row.original.status === "active";
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={`gap-1 px-2 text-xs ${isActive ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400" : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"}`}
          >
            {isActive ? (
              <IconCircleCheckFilled className="size-3 fill-green-500 dark:fill-green-400" />
            ) : (
              <IconLoader className="size-3 text-red-500" />
            )}
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-center">Terdaftar</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.created_at)}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Aksi</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <UserDetailDrawer user={row.original} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Buka Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => toast.info(`Edit User: ${row.original.name}`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => toast.error(`Hapus User: ${row.original.name}`)}
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableHiding: false, // Kolom Aksi tidak bisa di-hide
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data] = React.useState(() => initialData);

  // SET KOLOM YANG HIDDEN BY DEFAULT
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      email: false, // Hidden by default
      phone: false, // Hidden by default
      tanggal_lahir: false, // Hidden by default
      belt_achieved_at: false, // Hidden by default
      created_at: false, // Hidden by default
      // Kolom yang visible by default: name, roles, current_belt, status, actions
    });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [activeRole, setActiveRole] = React.useState<string>("semua");

  // Filter data berdasarkan role yang dipilih
  const filteredData = React.useMemo(() => {
    if (activeRole === "semua") {
      return data;
    }
    return data.filter((user) => {
      if (!user.roles) return false;
      return user.roles.toLowerCase().includes(activeRole.toLowerCase());
    });
  }, [data, activeRole]);

  // Hitung jumlah user per role
  const roleCounts = React.useMemo(() => {
    const counts = {
      semua: data.length,
      admin: 0,
      pelatih: 0,
      murid: 0,
    };

    data.forEach((user) => {
      if (!user.roles) return;
      const roles = user.roles.toLowerCase();
      if (roles.includes("admin")) counts.admin++;
      if (roles.includes("pelatih")) counts.pelatih++;
      if (roles.includes("murid")) counts.murid++;
    });

    return counts;
  }, [data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      value={activeRole}
      onValueChange={setActiveRole}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 flex">
          <TabsTrigger value="semua">
            Semua <Badge variant="secondary">{roleCounts.semua}</Badge>
          </TabsTrigger>
          <TabsTrigger value="admin">
            Admin <Badge variant="secondary">{roleCounts.admin}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pelatih">
            Pelatih <Badge variant="secondary">{roleCounts.pelatih}</Badge>
          </TabsTrigger>
          <TabsTrigger value="murid">
            Murid <Badge variant="secondary">{roleCounts.murid}</Badge>
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
                .map((column) => {
                  // Mapping label yang lebih user-friendly
                  const labelMap: Record<string, string> = {
                    name: "Nama",
                    email: "Email",
                    phone: "No. Telepon",
                    tanggal_lahir: "Tanggal Lahir",
                    roles: "Role",
                    current_belt: "Sabuk",
                    belt_achieved_at: "Sabuk Dicapai",
                    status: "Status",
                    created_at: "Terdaftar",
                  };

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {labelMap[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Tambah Pengguna</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value={activeRole}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="flex w-fit items-center justify-end text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount() || 1}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
