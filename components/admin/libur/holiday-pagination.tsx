'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LIMIT_OPTIONS } from '@/types/admin/libur';
import type { HolidayPaginationMeta } from '@/types/admin/libur';

interface HolidayPaginationProps {
    meta?: HolidayPaginationMeta;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    currentPage?: number;
}

export function HolidayPagination({
    meta,
    onPageChange,
    onPageSizeChange,
    currentPage = 1,
}: HolidayPaginationProps) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                {meta ? (
                    <>
                        Halaman{' '}
                        <span className="font-medium text-foreground">{meta.page}</span>{' '}
                        dari{' '}
                        <span className="font-medium text-foreground">
                            {meta.total_page}
                        </span>{' '}
                        &bull; Total{' '}
                        <span className="font-medium text-foreground">
                            {meta.total_data}
                        </span>{' '}
                        data
                    </>
                ) : (
                    ' '
                )}
            </p>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tampilkan</span>
                <Select
                    value={String(meta?.limit || 10)}
                    onValueChange={(v) => onPageSizeChange?.(Number(v))}
                >
                    <SelectTrigger className="w-[90px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LIMIT_OPTIONS.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={meta ? !meta.has_prev : true}
                >
                    Sebelumnya
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={meta ? !meta.has_next : true}
                >
                    Berikutnya
                </Button>
            </div>
        </div>
    );
}
