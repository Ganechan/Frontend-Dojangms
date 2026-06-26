import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EditKelasForm } from '@/components/admin/kelas/edit-kelas-form';
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { serverFetch } from '@/lib/serverFetch';

interface KelasEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function fetchKelasDetail(id: string) {
    try {
        // Gunakan serverFetch langsung pada Server Component (bukan fetch relative)
        const response = await serverFetch<{ data: any }>(
            `/api/admin/kelas/getkelasbyid/${id}`,
            {
                cache: 'no-store',
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching kelas:', error);
        return null;
    }
}

export default async function KelasEditPage(props: KelasEditPageProps) {
    const params = await props.params;
    const kelas = await fetchKelasDetail(params.id);

    if (!kelas) {
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
                                <div className="mx-auto w-full max-w-2xl space-y-4">
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
                                                    Kelas tidak ditemukan atau terjadi kesalahan saat mengambil data.
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
        <Suspense
            fallback={
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
                                    <div className="mx-auto w-full max-w-2xl">
                                        <div className="h-[300px] flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">Memuat form edit...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            }
        >
            <EditKelasForm kelas={kelas} />
        </Suspense>
    );
}