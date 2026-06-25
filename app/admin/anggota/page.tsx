export const dynamic = "force-dynamic";

import Link from 'next/link';
import { GraduationCap, Dumbbell, ShieldCheck, UserPlus } from 'lucide-react';

import { StatsCard } from '@/components/admin/anggota/stats-card';
import { RoleDistributionChart } from '@/components/admin/anggota/role-distribution-chart';
import { StatusDistributionChart } from '@/components/admin/anggota/status-distribution-chart';
import { BeltDistributionChart } from '@/components/admin/anggota/belt-distribution-chart';
import { LatestAnggotaTable } from '@/components/admin/anggota/lastest-member-table';
import { serverFetch } from '@/lib/serverFetch';
import type { AnggotaApiResponse, Anggota, BeltDistribution, StatsCounts } from '@/types/admin/anggota';

// Import komponen layout sidebar
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Map role ke path backend yang benar
const ROLE_PATHS: Record<string, string> = {
    murid: '/api/admin/get/user/murid',
    pelatih: '/api/admin/get/user/pelatih',
    admin: '/api/admin/get/allAdmin',
};

interface FetchResult {
    members: Anggota[];
    summary?: Record<string, unknown>;
}

async function fetchMembers(role: 'murid' | 'pelatih' | 'admin'): Promise<FetchResult> {
    try {
        const path = ROLE_PATHS[role];
        if (!path) {
            console.error(`Unknown role: ${role}`);
            return { members: [] };
        }
        const data = await serverFetch<AnggotaApiResponse<Anggota>>(
            `${path}?page=1&limit=100&status=all`,
            { cache: 'no-store' }
        );
        const members = (data.data || []).map((member) => ({ ...member, role }));
        return { members, summary: data.summary };
    } catch (error) {
        console.error(`Failed to fetch ${role}:`, error);
        return { members: [] };
    }
}

function calculateStats(members: Anggota[]): StatsCounts[] {
    const stats: Record<string, { total: number; active: number; inactive: number }> = {
        murid: { total: 0, active: 0, inactive: 0 },
        pelatih: { total: 0, active: 0, inactive: 0 },
        admin: { total: 0, active: 0, inactive: 0 },
    };

    members.forEach((member) => {
        const role = member.role as keyof typeof stats;
        if (stats[role]) {
            stats[role].total += 1;
            if (member.status === 'active') {
                stats[role].active += 1;
            } else {
                stats[role].inactive += 1;
            }
        }
    });

    return Object.entries(stats).map(([role, counts]) => ({
        role: role as 'murid' | 'pelatih' | 'admin',
        ...counts,
    }));
}

function getTotalStats(allStats: StatsCounts[]) {
    const total = allStats.reduce((sum, stat) => sum + stat.total, 0);
    const active = allStats.reduce((sum, stat) => sum + stat.active, 0);
    const inactive = allStats.reduce((sum, stat) => sum + stat.inactive, 0);
    return { total, active, inactive };
}

export default async function MemberPage() {
    // Fetch all members concurrently
    const [muridResult, pelatihResult, adminResult] = await Promise.all([
        fetchMembers('murid'),
        fetchMembers('pelatih'),
        fetchMembers('admin'),
    ]);

    const allMembers = [...muridResult.members, ...pelatihResult.members, ...adminResult.members];

    const totalPerBelt = (muridResult.summary?.total_per_belt as Record<string, number>) || {};
    const beltData: BeltDistribution[] = Object.entries(totalPerBelt).map(([belt_name, count]) => ({
        belt_name,
        count,
    }));

    const allStats = calculateStats(allMembers);
    const totalStats = getTotalStats(allStats);

    const latestMembers = allMembers
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

    const muridStats = allStats.find((s) => s.role === 'murid');
    const pelatihStats = allStats.find((s) => s.role === 'pelatih');
    const adminStats = allStats.find((s) => s.role === 'admin');

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

                            {/* Header Text */}
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Manajemen Anggota</h1>
                                <p className="text-muted-foreground mt-2">
                                    Dashboard statistik dan informasi semua anggota platform
                                </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                                <StatsCard
                                    title="Total Anggota"
                                    value={totalStats.total}
                                    description="Semua anggota platform"
                                />
                                <StatsCard
                                    title="Anggota Aktif"
                                    value={totalStats.active}
                                    description={`${totalStats.total > 0 ? ((totalStats.active / totalStats.total) * 100).toFixed(1) : '0.0'}% dari total`}
                                />
                                <StatsCard
                                    title="Total Murid"
                                    value={muridStats?.total || 0}
                                    description={`${muridStats?.active || 0} aktif, ${muridStats?.inactive || 0} tidak aktif`}
                                />
                                <StatsCard
                                    title="Total Pelatih"
                                    value={pelatihStats?.total || 0}
                                    description={`${pelatihStats?.active || 0} aktif, ${pelatihStats?.inactive || 0} tidak aktif`}
                                />
                            </div>

                            {/* Charts */}
                            <div className="grid gap-6 lg:grid-cols-2">
                                <RoleDistributionChart data={allStats} />
                                <StatusDistributionChart data={allStats} />
                            </div>

                            {/* Belt Distribution */}
                            <div>
                                <BeltDistributionChart data={beltData} />
                            </div>

                            {/* Latest Members Table */}
                            <div>
                                <LatestAnggotaTable members={latestMembers} />
                            </div>

                            {/* Quick Actions Section */}
                            <div className="flex flex-col gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Aksi Cepat</h2>
                                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                                    <Link
                                        href="/admin/anggota/murid"
                                        className="flex items-center gap-3 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 group"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <GraduationCap className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">Data Murid</span>
                                            <span className="text-xs text-muted-foreground">Lihat semua murid</span>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/anggota/pelatih"
                                        className="flex items-center gap-3 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 group"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Dumbbell className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">Data Pelatih</span>
                                            <span className="text-xs text-muted-foreground">Kelola staf pelatih</span>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/anggota/admin"
                                        className="flex items-center gap-3 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 group"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">Data Admin</span>
                                            <span className="text-xs text-muted-foreground">Hak akses manajemen</span>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/anggota/addUser"
                                        className="flex items-center gap-3 p-4 rounded-xl border bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200"
                                    >
                                        <div className="p-2 rounded-lg bg-white/20 text-primary-foreground">
                                            <UserPlus className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">Tambah User</span>
                                            <span className="text-xs text-primary-foreground/80">Registrasi anggota baru</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}