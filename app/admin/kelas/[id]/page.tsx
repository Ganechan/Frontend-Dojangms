'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
    ArrowLeft,
    MoreVertical,
    Edit,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import type { Kelas } from '@/types/admin/kelas';
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function KelasDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [kelas, setKelas] = useState<Kelas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchKelasDetail = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `http://localhost:3001/api/admin/kelas/getkelasbyid/${id}`
                );

                if (!response.ok) {
                    throw new Error('Gagal mengambil detail kelas');
                }

                const result = await response.json();
                setKelas(result.data);
            } catch (err) {
                console.error('Error fetching kelas detail:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Kelas tidak ditemukan atau terjadi kesalahan saat mengambil data'
                );
                toast.error(
                    'Kelas tidak ditemukan atau terjadi kesalahan saat mengambil data'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchKelasDetail();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        setIsDeleting(true);

        try {
            const response = await fetch(
                `http://localhost:3001/api/admin/kelas/delete/${id}`,
                {
                    method: 'DELETE',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Gagal menghapus kelas');
                return;
            }

            toast.success(result.message || 'Kelas berhasil dihapus');
            router.push('/admin/kelas');
        } catch (err) {
            console.error('Error deleting kelas:', err);
            toast.error('Terjadi kesalahan saat menghapus kelas');
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        return status === 'aktif' ? 'default' : 'secondary';
    };

    const getStatusLabel = (status: string) => {
        return status === 'aktif' ? 'Aktif' : 'Tidak Aktif';
    };

    if (loading) {
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
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
                                <div className="mx-auto w-full max-w-3xl space-y-6">
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                            <p className="text-sm text-muted-foreground">Mengambil data kelas...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (error || !kelas) {
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
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
                                <div className="mx-auto w-full max-w-3xl space-y-4">
                                    <Link href="/admin/kelas" className="inline-flex">
                                        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                                            <ArrowLeft className="h-4 w-4" />
                                            Kembali ke Manajemen Kelas
                                        </Button>
                                    </Link>

                                    <Card className="border-destructive/50 bg-destructive/5">
                                        <CardContent className="flex items-center gap-4 pt-6">
                                            <AlertCircle className="h-5 w-5 text-destructive" />
                                            <div>
                                                <p className="font-medium text-destructive">Terjadi Kesalahan</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {error || 'Kelas tidak ditemukan atau terjadi kesalahan saat mengambil data'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
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
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">
                            <div className="mx-auto w-full max-w-3xl space-y-6">

                                {/* Back Action & Header */}
                                <div className="space-y-4">
                                    <Link href="/admin/kelas" className="inline-flex">
                                        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:foreground">
                                            <ArrowLeft className="h-4 w-4" />
                                            Kembali ke Manajemen Kelas
                                        </Button>
                                    </Link>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight">
                                                {kelas.nama}
                                            </h1>
                                            <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-2">
                                                <span>ID Kelas:</span>
                                                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">{kelas.id}</code>
                                            </p>
                                        </div>

                                        {/* Action Menu */}
                                        <div className="flex gap-3 justify-end border-t pt-4">
                                            <Button variant="outline" asChild>
                                                <Link href={`/admin/kelas/${id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Kelas
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Info Card */}
                                <Card className="shadow-sm overflow-hidden p-0">
                                    <CardHeader className="bg-muted/30 border-b pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-semibold">Detail Informasi Kelas</CardTitle>
                                                <p className="text-xs text-muted-foreground mt-1">Spesifikasi dan konfigurasi kelas</p>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(kelas.status)} className="px-3 py-1">
                                                {getStatusLabel(kelas.status)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="divide-y divide-border p-6 space-y-6">
                                        {/* Nama Kelas */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pt-0">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Nama Kelas
                                            </span>
                                            <span className="text-base font-semibold md:col-span-2">{kelas.nama}</span>
                                        </div>

                                        {/* ID Kelas */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pt-6">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                ID Kelas
                                            </span>
                                            <span className="text-sm font-mono text-muted-foreground md:col-span-2">{kelas.id}</span>
                                        </div>

                                        {/* Deskripsi */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pt-6">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Deskripsi
                                            </span>
                                            <p className="text-sm text-foreground md:col-span-2 leading-relaxed whitespace-pre-line">
                                                {kelas.deskripsi || "Tidak ada deskripsi untuk kelas ini."}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pt-6">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Status Kelas
                                            </span>
                                            <div className="md:col-span-2 flex items-center gap-2">
                                                <Badge variant={getStatusBadgeVariant(kelas.status)} className="capitalize">
                                                    {getStatusLabel(kelas.status)}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {kelas.status === 'aktif'
                                                        ? 'Kelas aktif dan menerima pendaftaran murid baru.'
                                                        : 'Kelas tidak aktif dan tidak menerima murid baru.'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Delete Confirmation Dialog */}
                            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Apakah Anda yakin ingin menghapus kelas &quot;{kelas.nama}&quot;? Tindakan
                                            ini tidak dapat dibatalkan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 animate-fade-in"
                                    >
                                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                                    </AlertDialogAction>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
