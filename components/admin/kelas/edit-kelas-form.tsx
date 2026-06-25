'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Kelas {
    id: number;
    nama: string;
    deskripsi: string | null;
    status: 'aktif' | 'nonaktif';
}

interface EditKelasFormProps {
    kelas: Kelas;
}

export function EditKelasForm({ kelas }: EditKelasFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [formData, setFormData] = React.useState({
        nama: kelas.nama || '',
        deskripsi: kelas.deskripsi || '',
        status: kelas.status || 'aktif',
    });

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nama.trim()) {
            newErrors.nama = 'Nama kelas harus diisi';
        } else if (formData.nama.trim().length < 3) {
            newErrors.nama = 'Nama kelas minimal 3 karakter';
        }

        if (formData.deskripsi.trim().length > 0 && formData.deskripsi.trim().length < 10) {
            newErrors.deskripsi = 'Deskripsi minimal 10 karakter jika diisi';
        }

        if (!formData.status) {
            newErrors.status = 'Status harus dipilih';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            status: value as 'aktif' | 'nonaktif',
        }));
        if (errors.status) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.status;
                return newErrors;
            });
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Mohon perbaiki kesalahan pada form');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                nama: formData.nama.trim(),
                deskripsi: formData.deskripsi.trim(),
                status: formData.status,
            };

            const response = await fetch(
                `http://localhost:3001/api/admin/kelas/updatekelas/${kelas.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Gagal memperbarui kelas');
                return;
            }

            toast.success(data.message || 'Kelas berhasil diperbarui');
            router.push(`/admin/kelas/${kelas.id}`);
        } catch (error) {
            console.error('Error updating kelas:', error);
            toast.error('Terjadi kesalahan saat memperbarui kelas');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <div className="mx-auto w-full max-w-2xl space-y-6">

                                {/* Back Navigation & Header */}
                                <div className="space-y-4">
                                    <Link href={`/admin/kelas/${kelas.id}`} className="inline-flex">
                                        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:foreground">
                                            <ArrowLeft className="h-4 w-4" />
                                            Kembali ke Detail Kelas
                                        </Button>
                                    </Link>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight">
                                                Edit Kelas
                                            </h1>
                                            <p className="mt-1.5 text-sm text-muted-foreground flex items-center gap-2">
                                                <span>Memperbarui informasi kelas</span>
                                                <Badge variant="outline" className="font-mono text-[11px]">{kelas.nama}</Badge>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Card */}
                                <Card className="shadow-sm overflow-hidden p-0">
                                    <CardHeader className="bg-muted/30 border-b pt-6">
                                        <div>
                                            <CardTitle className="text-lg font-semibold">Informasi Kelas</CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Lengkapi data di bawah ini untuk memperbarui kelas
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <form onSubmit={onSubmit} className="space-y-6">
                                            {/* Nama Kelas */}
                                            <div className="space-y-2">
                                                <Label htmlFor="nama">
                                                    Nama Kelas <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="nama"
                                                    name="nama"
                                                    placeholder="Contoh: Kelas Taekwondo Pemula"
                                                    value={formData.nama}
                                                    onChange={handleInputChange}
                                                    disabled={isSubmitting}
                                                    className={errors.nama ? 'border-destructive focus-visible:ring-destructive' : ''}
                                                />
                                                {errors.nama ? (
                                                    <p className="text-sm text-destructive">{errors.nama}</p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Minimal 3 karakter</p>
                                                )}
                                            </div>

                                            <Separator />

                                            {/* Deskripsi */}
                                            <div className="space-y-2">
                                                <Label htmlFor="deskripsi">
                                                    Deskripsi <span className="text-muted-foreground font-normal">(Opsional)</span>
                                                </Label>
                                                <textarea
                                                    id="deskripsi"
                                                    name="deskripsi"
                                                    rows={4}
                                                    placeholder="Contoh: Kelas untuk pemula usia 8-13 tahun"
                                                    value={formData.deskripsi}
                                                    onChange={handleInputChange}
                                                    disabled={isSubmitting}
                                                    className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.deskripsi ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
                                                        }`}
                                                />
                                                {errors.deskripsi ? (
                                                    <p className="text-sm text-destructive">{errors.deskripsi}</p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Minimal 10 karakter jika diisi</p>
                                                )}
                                            </div>

                                            <Separator />

                                            {/* Status */}
                                            <div className="space-y-2">
                                                <Label htmlFor="status">
                                                    Status <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.status}
                                                    onValueChange={handleStatusChange}
                                                    disabled={isSubmitting}
                                                >
                                                    <SelectTrigger className={errors.status ? 'border-destructive focus:ring-destructive' : ''}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="aktif">Aktif</SelectItem>
                                                        <SelectItem value="nonaktif">Tidak Aktif</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status ? (
                                                    <p className="text-sm text-destructive">{errors.status}</p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">
                                                        {formData.status === 'aktif'
                                                            ? 'Kelas aktif dan menerima pendaftaran murid baru.'
                                                            : 'Kelas tidak aktif dan tidak menerima murid baru.'
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <Separator />
                                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => router.back()}
                                                    disabled={isSubmitting}
                                                    className="gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Batal
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="gap-2"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                </Button>
                                            </div>
                                        </form>
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
