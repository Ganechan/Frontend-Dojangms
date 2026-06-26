'use client';

import { CreateScheduleForm } from '@/components/admin/jadwal/create-jadwal-form';
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateSchedulePage() {
    const router = useRouter();
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
                        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="mb-2 w-fit"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                            <CreateScheduleForm />
                        </div>
                    </div>
                </div>
                <Toaster position="top-right" />
            </SidebarInset>
        </SidebarProvider>
    );
}
