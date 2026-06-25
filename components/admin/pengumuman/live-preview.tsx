// components\admin\pengumuman\live-preview.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LivePreviewProps {
  formValues: any;
}

export function LivePreview({ formValues }: LivePreviewProps) {
  const isEmpty = !formValues.judul && !formValues.isi;

  const getTargetLabel = () => {
    switch (formValues.target_type) {
      case "global":
        return "Semua Pengguna";
      case "role":
        return `Role: ${formValues.target_role || "-"}`;
      case "kelas":
        return `Kelas ID: ${formValues.kelas_id || "-"}`;
      case "individu":
        return `${formValues.user_ids?.length || 0} Pengguna`;
      default:
        return "-";
    }
  };

  const getStatusColor = () => {
    switch (formValues.status) {
      case "draft":
        return "secondary";
      case "terjadwal":
        return "outline";
      case "terkirim":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = () => {
    switch (formValues.status) {
      case "draft":
        return "Draft";
      case "terjadwal":
        return "Terjadwal";
      case "terkirim":
        return "Terkirim";
      default:
        return "-";
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg">Live Preview</CardTitle>
        <CardDescription>Pratinjau pengumuman Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEmpty ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Isi formulir untuk melihat pratinjau
            </p>
          </div>
        ) : (
          <>
            {/* Title */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                JUDUL
              </p>
              <p className="text-base font-semibold text-foreground">
                {formValues.judul || "(Belum diisi)"}
              </p>
            </div>

            <Separator />

            {/* Content */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                ISI PENGUMUMAN
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
                {formValues.isi || "(Belum diisi)"}
              </p>
              {formValues.isi && formValues.isi.length > 200 && (
                <p className="text-xs text-muted-foreground mt-1">
                  +{Math.ceil(formValues.isi.length / 200) - 1} baris lebih
                </p>
              )}
            </div>

            <Separator />

            {/* Target */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                TARGET
              </p>
              <Badge variant="outline">{getTargetLabel()}</Badge>
            </div>

            {/* WhatsApp Status */}
            {formValues.kirim_whatsapp && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    WHATSAPP
                  </p>
                  <div className="space-y-1">
                    <Badge variant="outline">Kirim: Ya</Badge>
                    <p className="text-xs text-foreground mt-1">
                      Scope:{" "}
                      {formValues.whatsapp_scope === "semua_grup"
                        ? "Semua Grup"
                        : formValues.whatsapp_scope === "grup_besar_saja"
                          ? "Grup Besar Saja"
                          : `Grup ID: ${formValues.whatsapp_group_id}`}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Scheduled Time */}
            {formValues.status === "terjadwal" && formValues.scheduled_at && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    JADWAL PENGIRIMAN
                  </p>
                  <p className="text-sm text-foreground">
                    {formValues.scheduled_at}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Publication Status */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                STATUS PUBLIKASI
              </p>
              <Badge variant={getStatusColor() as any}>
                {getStatusLabel()}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
