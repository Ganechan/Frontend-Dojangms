"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type {
    ActiveScheduleTab,
    ScheduleData,
    ScheduleStatusCounts,
    ScheduleType,
    Kelas,
} from "@/types/admin/jadwal";

interface ScheduleTableToolbarProps {
    table: Table<ScheduleData>;
    statusCounts?: ScheduleStatusCounts;
    onSearchChange?: (q: string) => void;
    onStatusChange?: (status: ActiveScheduleTab) => void;
    onTypeChange?: (type: ScheduleType | 'all') => void;
    onKelasChange?: (kelasId: number | null) => void;
    initialSearch?: string;
    initialStatus?: ActiveScheduleTab;
    initialType?: ScheduleType | 'all';
    initialKelasId?: number | null;
    kelasList?: Kelas[];
    isLoading?: boolean;
}

const TABS: { value: ActiveScheduleTab; label: string }[] = [
    { value: "total", label: "Total" },
    { value: "aktif", label: "Aktif" },
    { value: "nonaktif", label: "Tidak Aktif" },
];

const TYPE_OPTIONS = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'latihan_wajib', label: 'Latihan Wajib' },
    { value: 'kelas', label: 'Kelas' },
    { value: 'training_camp', label: 'Training Camp' },
];

export function ScheduleTableToolbar({
    table,
    statusCounts,
    onSearchChange,
    onStatusChange,
    onTypeChange,
    onKelasChange,
    initialSearch,
    initialType = 'all',
    initialKelasId,
    kelasList = [],
    isLoading = false,
}: ScheduleTableToolbarProps) {
    const [q, setQ] = React.useState(initialSearch ?? "");
    const [selectedType, setSelectedType] = React.useState<ScheduleType | 'all'>(
        initialType
    );
    const [selectedKelas, setSelectedKelas] = React.useState<number | null>(
        initialKelasId ?? null
    );

    React.useEffect(() => {
        setQ(initialSearch ?? "");
    }, [initialSearch]);

    React.useEffect(() => {
        setSelectedType(initialType);
    }, [initialType]);

    const applySearch = () => onSearchChange?.(q.trim());

    const clear = () => {
        setQ("");
        setSelectedType('all');
        setSelectedKelas(null);
        onSearchChange?.("");
        onTypeChange?.('all');
        onKelasChange?.(null);
        table.resetColumnFilters();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") applySearch();
    };

    const handleTypeChange = (type: string) => {
        const newType = type as ScheduleType | 'all';
        setSelectedType(newType);
        setSelectedKelas(null);
        onTypeChange?.(newType);
        onKelasChange?.(null);
    };

    return (
        <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
            <div className="flex flex-col gap-4">
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
                    <Link href="/admin/jadwal/create">
                        <Button className="w-full sm:w-auto gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Tambah Jadwal</span>
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-1">
                        <Select
                            value={selectedType}
                            onValueChange={handleTypeChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="sm:w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedType === 'kelas' && (
                            <Select
                                value={selectedKelas?.toString() ?? ""}
                                onValueChange={(v) => {
                                    const kelasId = v ? Number(v) : null;
                                    setSelectedKelas(kelasId);
                                    onKelasChange?.(kelasId);
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="sm:w-[200px]">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelasList.map((kelas) => (
                                        <SelectItem key={kelas.id} value={kelas.id.toString()}>
                                            {kelas.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Cari nama jadwal..."
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
        </div>
    );
}
