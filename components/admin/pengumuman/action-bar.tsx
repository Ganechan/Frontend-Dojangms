//components\admin\pengumuman\action-bar.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface ActionBarProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function ActionBar({ form, onSubmit, isLoading }: ActionBarProps) {
  const status = form.watch("status");
  const judul = form.watch("judul");
  const isi = form.watch("isi");

  const isFormValid = judul && isi;

  const handleCancel = () => {
    form.reset();
  };

  const handleSaveDraft = () => {
    form.setValue("status", "draft");
    setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 0);
  };

  const handleSchedule = () => {
    form.setValue("status", "terjadwal");
    setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 0);
  };

  const handleSendNow = () => {
    form.setValue("status", "terkirim");
    setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 0);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batal
          </Button>

          {status === "draft" && (
            <Button
              type="button"
              variant="default"
              onClick={handleSaveDraft}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Draft"}
            </Button>
          )}

          {status === "terjadwal" && (
            <Button
              type="button"
              variant="default"
              onClick={handleSchedule}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Menjadwalkan..." : "Jadwalkan Pengiriman"}
            </Button>
          )}

          {status === "terkirim" && (
            <Button
              type="button"
              variant="default"
              onClick={handleSendNow}
              disabled={!isFormValid || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Mengirim..." : "Kirim Sekarang"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
