"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ArrowLeft,
    UserCheck,
    UserX,
    AlertCircle,
    UserSearch,
    CalendarDays,
    Mail,
    Phone,
    MapPin,
    User,
    Shield,
    Users,
    RefreshCw,
    Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PendingUserDetail {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    birth_date: string | null;
    birth_year: number | null;
    gender: string | null;
    address: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    current_belt: string | null;
    foto: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: PendingUserDetail;
}

const MONTHS_ID = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

function formatDate(iso: string | null): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateTime(iso: string | null): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()} ${hh}:${mm}`;
}

function displayValue(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

const AVATAR_COLORS = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-orange-100 text-orange-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
];

function getAvatarColor(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const BELT_COLORS: Record<string, string> = {
    putih: "bg-gray-100 text-gray-700 border-gray-200",
    kuning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    hijau: "bg-green-100 text-green-700 border-green-200",
    biru: "bg-blue-100 text-blue-700 border-blue-200",
    merah: "bg-red-100 text-red-700 border-red-200",
    hitam: "bg-neutral-900 text-white border-neutral-700",
};

function getBeltClass(belt: string | null): string {
    if (!belt) return "bg-gray-100 text-gray-700 border-gray-200";
    return BELT_COLORS[belt.toLowerCase()] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

function getAvatarUrl(foto: string | null): string | undefined {
    if (!foto) return undefined;
    if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
    return `/api/auth/avatar?path=${encodeURIComponent(foto)}`;
}

function DetailSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
                <Card className="shadow-sm">
                    <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
                        <Skeleton className="size-24 rounded-full" />
                        <div className="flex flex-col items-center gap-2 w-full">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-4 w-44" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-5 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-12">
                <Card className="shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-5 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ApprovalUserDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [data, setData] = useState<PendingUserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setError(false);
        setNotFound(false);
        try {
            const res = await fetch(`/api/auth/user-pending/${id}`, {
                credentials: "include",
            });
            if (!res.ok) {
                if (res.status === 404) {
                    setNotFound(true);
                } else {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.message || "Gagal memuat data");
                }
                return;
            }
            const json: ApiResponse = await res.json();
            if (json.success && json.data) {
                setData(json.data);
            } else {
                setNotFound(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(true);
            toast.error(err.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchDetail();
    }, [id, fetchDetail]);

    async function handleApprove() {
        setApproveLoading(true);
        try {
            const res = await fetch(`/api/auth/user-pending/${id}/approve`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Gagal menyetujui");
            }
            toast.success("Akun berhasil disetujui.");
            setApproveOpen(false);
            router.push("/admin/approve");
        } catch (err: any) {
            toast.error(err.message || "Gagal menyetujui akun");
        } finally {
            setApproveLoading(false);
        }
    }

    async function handleReject() {
        setRejectLoading(true);
        try {
            const res = await fetch(`/api/auth/user-pending/${id}/reject`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Gagal menolak");
            }
            toast.success("Akun berhasil ditolak.");
            setRejectOpen(false);
            router.push("/admin/approve");
        } catch (err: any) {
            toast.error(err.message || "Gagal menolak akun");
        } finally {
            setRejectLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <PageHeader loading />
                    <div className="mt-6">
                        <DetailSkeleton />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <PageHeader onBack={() => router.push("/admin/approve")} />
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <Alert variant="destructive" className="max-w-md">
                            <AlertCircle className="size-4" />
                            <AlertTitle>Gagal Memuat Detail Pengguna</AlertTitle>
                            <AlertDescription>Terjadi kesalahan saat mengambil data pengguna.</AlertDescription>
                        </Alert>
                        <Button variant="outline" onClick={fetchDetail} className="gap-2">
                            <RefreshCw className="size-4 mr-2" />
                            Coba Lagi
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (notFound || !data) {
        return (
            <main className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <PageHeader onBack={() => router.push("/admin/approve")} />
                    <div className="mt-12 flex flex-col items-center gap-6 text-center">
                        <div className="rounded-full bg-muted p-6">
                            <UserSearch className="size-12 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-semibold text-foreground">Pengguna Tidak Ditemukan</h2>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Data pengguna tidak tersedia atau sudah diproses.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => router.push("/admin/approve")} className="gap-2">
                            <ArrowLeft className="size-4 mr-2" />
                            Kembali
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    const avatarColor = getAvatarColor(data.id);
    const avatarUrl = getAvatarUrl(data.foto);

    return (
        <>
            <main className="min-h-screen bg-muted/30 pb-28">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <PageHeader onBack={() => router.push("/admin/approve")} status={data.status} />

                    <div className="mt-6 grid gap-6 lg:grid-cols-12">
                        {/* Profile Card */}
                        <div className="lg:col-span-4">
                            <Card className="shadow-sm">
                                <CardContent className="flex flex-col items-center gap-4 px-6 pb-8 pt-8">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={data.name}
                                            className="size-24 rounded-full object-cover ring-2 ring-border"
                                        />
                                    ) : (
                                        <div
                                            className={`flex size-24 items-center justify-center rounded-full text-2xl font-bold ring-2 ring-border ${avatarColor}`}
                                        >
                                            {getInitials(data.name)}
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <h2 className="text-lg font-semibold leading-tight text-foreground">
                                            {data.name}
                                        </h2>
                                        <StatusBadge status={data.status} />
                                    </div>
                                    <Separator />
                                    <div className="flex w-full flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                            <span className="break-all text-sm text-foreground">{data.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="size-4 shrink-0 text-muted-foreground" />
                                            <span className="text-sm text-foreground">{displayValue(data.phone)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Information Card */}
                        <div className="lg:col-span-8">
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <User className="size-4 text-muted-foreground" />
                                        Informasi Pengguna
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                                        <InfoField label="Nama Lengkap" value={displayValue(data.name)} />
                                        <InfoField label="Email" value={displayValue(data.email)} />
                                        <InfoField label="Nomor HP" value={displayValue(data.phone)} />
                                        <InfoField label="Tanggal Lahir" value={data.birth_date ? formatDate(data.birth_date) : "-"} />
                                        <InfoField label="Tahun Lahir" value={displayValue(data.birth_year)} />
                                        <InfoField
                                            label="Jenis Kelamin"
                                            value={
                                                data.gender === "L"
                                                    ? "Laki-laki"
                                                    : data.gender === "P"
                                                        ? "Perempuan"
                                                        : displayValue(data.gender)
                                            }
                                        />
                                        <InfoField label="Alamat" value={displayValue(data.address)} fullWidth />
                                        <InfoField label="Nama Wali" value={displayValue(data.guardian_name)} />
                                        <InfoField label="Nomor Wali" value={displayValue(data.guardian_phone)} />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Sabuk Saat Ini
                                            </span>
                                            {data.current_belt ? (
                                                <Badge variant="outline" className={`w-fit capitalize ${getBeltClass(data.current_belt)}`}>
                                                    {data.current_belt}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">-</span>
                                            )}
                                        </div>
                                        <InfoField label="Tanggal Registrasi" value={formatDateTime(data.created_at)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Registration Summary Card */}
                        <div className="lg:col-span-12">
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Shield className="size-4 text-muted-foreground" />
                                        Ringkasan Pendaftaran
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Status
                                            </span>
                                            <StatusBadge status={data.status} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Sabuk Awal
                                            </span>
                                            {data.current_belt ? (
                                                <Badge variant="outline" className={`w-fit capitalize ${getBeltClass(data.current_belt)}`}>
                                                    {data.current_belt}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">-</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Tanggal Registrasi
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
                                                <span className="text-sm text-foreground">{formatDateTime(data.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Last Update
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                                                <span className="text-sm text-foreground">{formatDateTime(data.updated_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-4 sm:px-6 lg:px-8">
                    <Button
                        variant="destructive"
                        className="w-full gap-2 sm:w-auto"
                        onClick={() => setRejectOpen(true)}
                    >
                        <UserX className="size-4 mr-2" />
                        Tolak
                    </Button>
                    <Button
                        className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white sm:w-auto"
                        onClick={() => setApproveOpen(true)}
                    >
                        <UserCheck className="size-4 mr-2" />
                        Setujui
                    </Button>
                </div>
            </div>

            {/* Approve Dialog */}
            <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setujui Pendaftaran?</DialogTitle>
                        <DialogDescription>
                            Pengguna akan diaktifkan dan dapat login ke sistem. Sistem juga akan
                            mengirimkan notifikasi WhatsApp apabila nomor pengguna tersedia.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setApproveOpen(false)} disabled={approveLoading}>
                            Batal
                        </Button>
                        <Button
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleApprove}
                            disabled={approveLoading}
                        >
                            {approveLoading ? <RefreshCw className="size-4 animate-spin mr-2" /> : <UserCheck className="size-4 mr-2" />}
                            Setujui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pendaftaran?</DialogTitle>
                        <DialogDescription>
                            Pengguna tidak akan dapat menggunakan sistem hingga melakukan pendaftaran kembali.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={rejectLoading}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="gap-2" onClick={handleReject} disabled={rejectLoading}>
                            {rejectLoading ? <RefreshCw className="size-4 animate-spin mr-2" /> : <UserX className="size-4 mr-2" />}
                            Tolak
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function PageHeader({
    loading = false,
    onBack,
    status,
}: {
    loading?: boolean;
    onBack?: () => void;
    status?: string;
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Detail Persetujuan Akun
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Periksa data calon pengguna sebelum menyetujui atau menolak pendaftaran.
                    </p>
                </div>
                {loading && <Skeleton className="h-6 w-20" />}
                {!loading && status && <StatusBadge status={status} />}
            </div>
            <div>
                {loading ? (
                    <Skeleton className="h-9 w-28" />
                ) : (
                    <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
                        <ArrowLeft className="size-4 mr-2" />
                        Kembali
                    </Button>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const lower = status?.toLowerCase();
    if (lower === "pending") {
        return (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                Pending
            </Badge>
        );
    }
    if (lower === "approved" || lower === "active") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                {status}
            </Badge>
        );
    }
    if (lower === "rejected") {
        return (
            <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                {status}
            </Badge>
        );
    }
    return <Badge variant="secondary">{status}</Badge>;
}

function InfoField({
    label,
    value,
    fullWidth = false,
}: {
    label: string;
    value: string;
    fullWidth?: boolean;
}) {
    const isMissing = value === "-";
    return (
        <div className={`flex flex-col gap-1 ${fullWidth ? "sm:col-span-2" : ""}`}>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </span>
            <span
                className={`text-sm leading-relaxed ${isMissing ? "text-muted-foreground" : "text-foreground"
                    }`}
            >
                {value}
            </span>
        </div>
    );
}