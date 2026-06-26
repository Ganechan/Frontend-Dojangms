// app/admin/jadwal/jadwal/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { EditScheduleForm } from '@/components/admin/jadwal/edit-jadwal-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type {
    ScheduleDetailData,
    ScheduleDetailResponse,
    Kelas,
} from '@/types/admin/jadwal';
import { ArrowLeft } from 'lucide-react';
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface EditSchedulePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditSchedulePage({ params }: EditSchedulePageProps) {
    const router = useRouter();
    const { id } = React.use(params);
    const [scheduleData, setScheduleData] = useState<ScheduleDetailData | null>(
        null
    );
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 🔥 Fetch schedule detail via internal API
                const scheduleResponse = await fetch(
                    `/api/admin/jadwal/${id}`
                );

                if (!scheduleResponse.ok) {
                    const errData = await scheduleResponse.json().catch(() => ({}));
                    throw new Error(errData.message || 'Gagal mengambil detail jadwal');
                }

                const scheduleRes: ScheduleDetailResponse =
                    await scheduleResponse.json();
                setScheduleData(scheduleRes.data);

                // Fetch kelas list via internal API
                const kelasResponse = await fetch(
                    '/api/admin/kelas/getallkelas?page=1&limit=100&status=aktif'
                );

                if (kelasResponse.ok) {
                    const kelasData = await kelasResponse.json();
                    if (kelasData.data) {
                        setKelasList(kelasData.data);
                    }
                } else {
                    // Jika gagal ambil kelas, kita tetap lanjutkan (tidak blocking)
                    console.warn('Gagal mengambil daftar kelas');
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Terjadi kesalahan';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                                <Card>
                                    <CardContent className="flex h-96 items-center justify-center">
                                        <p className="text-muted-foreground">Memuat data...</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (error || !scheduleData) {
        return (
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="mb-2 w-fit"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </Button>
                                <Card className="border-destructive">
                                    <CardHeader>
                                        <CardTitle className="text-destructive">Error</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            {error || 'Jadwal tidak ditemukan atau terjadi kesalahan saat mengambil data.'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="mb-2 w-fit"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>

                            <EditScheduleForm
                                scheduleData={scheduleData}
                                kelasList={kelasList}
                                scheduleId={parseInt(id)}
                            />
                        </div>
                    </div>
                </div>
                <Toaster position="top-right" />
            </SidebarInset>
        </SidebarProvider>
    );
}