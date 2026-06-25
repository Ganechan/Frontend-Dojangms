'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HolidayToolbarProps {
    onFilterChange?: (filters: {
        tanggal_start: string;
        tanggal_end: string;
    }) => void;
    isLoading?: boolean;
}

export function HolidayToolbar({
    onFilterChange,
    isLoading = false,
}: HolidayToolbarProps) {
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');

    const applyFilter = () => {
        onFilterChange?.({
            tanggal_start: startDate,
            tanggal_end: endDate,
        });
    };

    const clear = () => {
        setStartDate('');
        setEndDate('');
        onFilterChange?.({
            tanggal_start: '',
            tanggal_end: '',
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') applyFilter();
    };

    return (
        <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <label htmlFor="start-date" className="text-sm font-medium">
                            Dari Tanggal:
                        </label>
                        <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="sm:w-[180px]"
                        />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <label htmlFor="end-date" className="text-sm font-medium">
                            Sampai Tanggal:
                        </label>
                        <Input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="sm:w-[180px]"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={applyFilter}
                        disabled={isLoading}
                    >
                        Filter
                    </Button>
                    <Button variant="ghost" onClick={clear} disabled={isLoading}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
