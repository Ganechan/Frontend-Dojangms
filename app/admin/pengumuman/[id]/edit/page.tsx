"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { AnnouncementForm } from "@/components/admin/pengumuman/announcement-form";
import { LivePreview } from "@/components/admin/pengumuman/live-preview";
import { ActionBar } from "@/components/admin/pengumuman/action-bar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
  user_ids: z.array(z.number()).default([]),
  kirim_whatsapp: z.boolean().default(false),
  whatsapp_scope: z
    .enum(["semua_grup", "grup_besar_saja", "grup_tertentu"])
    .optional(),
  whatsapp_group_id: z.number().optional(),
  status: z.enum(["draft", "terjadwal", "terkirim"]).default("draft"),
  scheduled_at: z.string().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      judul: "",
      isi: "",
      target_type: "global",
      target_role: "",
      kelas_id: undefined,
      user_ids: [],
      kirim_whatsapp: false,
      whatsapp_scope: undefined,
      whatsapp_group_id: undefined,
      status: "draft",
      scheduled_at: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/pengumuman/${id}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal mengambil data");
        const data = result.data;

        // Map data ke form values
        form.reset({
          judul: data.judul,
          isi: data.isi,
          target_type: data.target.target_type,
          target_role: data.target.target_role || "",
          kelas_id: data.target.kelas_id || undefined,
          user_ids: data.target.target_user_ids || [],
          kirim_whatsapp: data.kirim_whatsapp,
          whatsapp_scope: data.whatsapp?.scope || undefined,
          whatsapp_group_id: data.whatsapp?.group_id || undefined,
          status: data.status,
          scheduled_at: data.scheduled_at || "",
        });
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, form]);

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      setIsSubmitting(true);
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

      const response = await fetch(`/api/admin/pengumuman/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal memperbarui pengumuman");

      toast.success("Pengumuman berhasil diperbarui");
      router.push(`/admin/pengumuman/${id}`);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui pengumuman");
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                  <Card className="mb-6 bg-red-50 border-red-200 p-4">
                    <p className="text-red-800">{error}</p>
                  </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <AnnouncementForm
                      form={form}
                      onSubmit={onSubmit}
                      isLoading={isSubmitting}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <div className="sticky top-24">
                      <LivePreview formValues={form.watch()} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Action Bar */}
              <ActionBar
                form={form}
                onSubmit={onSubmit}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
