"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnnouncementForm } from "@/components/admin/pengumuman/announcement-form";
import { LivePreview } from "@/components/admin/pengumuman/live-preview";
import { ActionBar } from "@/components/admin/pengumuman/action-bar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const announcementSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul harus diisi")
    .max(200, "Judul maksimal 200 karakter"),
  isi: z
    .string()
    .min(1, "Isi harus diisi")
    .max(5000, "Isi maksimal 5000 karakter"),
  target_type: z.enum(["global", "role", "kelas", "individu"]),
  target_role: z.string().optional(),
  kelas_id: z.number().optional(),
  user_ids: z.array(z.number()).optional(),
  kirim_whatsapp: z.boolean().optional(),
  whatsapp_scope: z
    .enum(["semua_grup", "grup_besar_saja", "grup_tertentu"])
    .optional(),
  whatsapp_group_id: z.number().optional(),
  status: z.enum(["draft", "terjadwal", "terkirim"]).optional(),
  scheduled_at: z.string().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function TambahPengumumanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      judul: "",
      isi: "",
      target_type: "global",
      user_ids: [],
      kirim_whatsapp: false,
      status: "draft",
    },
  });

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload: any = {
        judul: data.judul,
        isi: data.isi,
        target_type: data.target_type,
        status: data.status,
      };

      if (data.target_type === "role") {
        payload.target_role = data.target_role;
      } else if (data.target_type === "kelas") {
        payload.kelas_id = data.kelas_id;
      } else if (data.target_type === "individu") {
        payload.user_ids = data.user_ids;
      }

      if (data.kirim_whatsapp) {
        payload.kirim_whatsapp = true;
        if (data.whatsapp_scope === "grup_tertentu") {
          payload.whatsapp_group_id = data.whatsapp_group_id;
        } else {
          payload.whatsapp_scope = data.whatsapp_scope;
        }
      }

      if (data.status === "terjadwal" && data.scheduled_at) {
        payload.scheduled_at = data.scheduled_at;
      }

      const response = await fetch("/api/admin/pengumuman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim pengumuman");
      }

      // Success
      form.reset();
      toast.success("Pengumuman berhasil dibuat");
    } catch (err: any) {
      setError(err.message || "Gagal mengirim pengumuman");
      toast.error(err.message || "Gagal mengirim pengumuman");
    } finally {
      setIsLoading(false);
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
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6 pb-32">
              {/* Header */}
              <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">
                  Tambah Pengumuman
                </h1>
                <p className="text-muted-foreground mt-1.5">
                  Buat dan kirim pengumuman baru ke murid, pelatih, atau semua pengguna
                </p>
              </div>

              {error && (
                <Card className="border-l-4 border-l-destructive bg-destructive/5 dark:bg-destructive/10">
                  <CardContent className="flex items-start gap-3 p-4">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">
                        Terjadi Kesalahan
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {error}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Form Section - Left */}
                <div className="lg:col-span-2">
                  <AnnouncementForm
                    form={form}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                  />
                </div>

                {/* Live Preview - Right */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <LivePreview formValues={form.watch()} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <ActionBar
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
