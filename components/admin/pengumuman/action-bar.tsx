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

          <Button
            type="button"
            variant={status === "draft" ? "default" : "outline"}
            onClick={handleSaveDraft}
            disabled={!isFormValid || isLoading}
          >
            {isLoading && status === "draft" ? "Menyimpan..." : "Simpan Draft"}
          </Button>

          <Button
            type="button"
            variant={status === "terjadwal" ? "default" : "outline"}
            onClick={handleSchedule}
            disabled={!isFormValid || isLoading}
          >
            {isLoading && status === "terjadwal"
              ? "Menjadwalkan..."
              : "Jadwalkan Pengiriman"}
          </Button>

          <Button
            type="button"
            variant={status === "terkirim" ? "default" : "outline"}
            onClick={handleSendNow}
            disabled={!isFormValid || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading && status === "terkirim"
              ? "Mengirim..."
              : "Kirim Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  );
}
