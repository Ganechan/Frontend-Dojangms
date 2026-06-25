// components/admin/admin/admin-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PhoneIcon,
    MailIcon,
    Calendar,
    MapPin,
    SquarePenIcon,
} from "lucide-react";
import Link from "next/link";

import type { AdminDetail } from "@/types/admin/admin";

// ── helpers ───────────────────────────────────────────────────────────────────

function getStatusLabel(status: string) {
    switch (status) {
        case "active": return "Aktif";
        case "inactive": return "Tidak Aktif";
        default: return status;
    }
}

function getStatusClass(status: string) {
    switch (status) {
        case "active":
            return "border-transparent bg-emerald-100 text-emerald-800";
        case "inactive":
            return "border-transparent bg-slate-100 text-slate-800";
        default:
            return "border-transparent bg-blue-100 text-blue-800";
    }
}

function formatDate(dateString: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// ── props ─────────────────────────────────────────────────────────────────────

interface AdminCardProps {
    admin: AdminDetail;
}

// ── component ─────────────────────────────────────────────────────────────────

export function AdminCard({ admin }: AdminCardProps) {
    return (
        <Card className="p-8">
            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{admin.name}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Administrator</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={getStatusClass(admin.status)}>
                        {getStatusLabel(admin.status)}
                    </Badge>
                    <Link href={`/admin/anggota/admin/${admin.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-200/55 border-emerald-200">
                            <SquarePenIcon className="h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── Grid info ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Email */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Email
                    </p>
                    <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-primary shrink-0" />
                        <a
                            href={`mailto:${admin.email}`}
                            className="text-sm text-foreground hover:text-primary transition-colors"
                        >
                            {admin.email || "-"}
                        </a>
                    </div>
                </div>

                {/* No. HP */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Nomor Telepon
                    </p>
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-primary shrink-0" />
                        <a
                            href={`tel:${admin.phone}`}
                            className="text-sm text-foreground hover:text-primary transition-colors"
                        >
                            {admin.phone || "-"}
                        </a>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Tanggal Lahir
                    </p>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground">
                            {formatDate(admin.tanggal_lahir)}
                        </span>
                    </div>
                </div>

                {/* Tanggal Bergabung */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Tanggal Bergabung
                    </p>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground">
                            {formatDate(admin.tanggal_bergabung)}
                        </span>
                    </div>
                </div>

                {/* Jenis Kelamin */}
                {admin.jenis_kelamin && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Jenis Kelamin
                        </p>
                        <span className="text-sm text-foreground capitalize">
                            {admin.jenis_kelamin}
                        </span>
                    </div>
                )}

            </div>

            {/* Alamat */}
            {admin.alamat && (
                <div className="mt-6 pt-6 border-t">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Alamat
                    </p>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">{admin.alamat}</p>
                    </div>
                </div>
            )}
        </Card>
    );
}