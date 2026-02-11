"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Championship, FormData, LEVEL_OPTIONS } from "./hooks/useChampionship";

interface ChampionshipFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChampionship: Championship | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function ChampionshipFormDialog({
  open,
  onOpenChange,
  selectedChampionship,
  formData,
  setFormData,
  onSave,
  isSubmitting,
}: ChampionshipFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedChampionship ? "Edit Kejuaraan" : "Tambah Kejuaraan Baru"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kejuaraan</Label>
            <Input
              id="name"
              placeholder="Masukkan nama kejuaraan"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value: any) =>
                setFormData({ ...formData, level: value })
              }
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="Pilih level" />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              placeholder="Masukkan lokasi kejuaraan"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <DatePickerField
            label="Tanggal Mulai"
            value={formData.start_date}
            onChange={(date) => setFormData({ ...formData, start_date: date })}
            disabledDate={(date) =>
              formData.end_date ? date > formData.end_date : false
            }
          />

          <DatePickerField
            label="Tanggal Akhir"
            value={formData.end_date}
            onChange={(date) => setFormData({ ...formData, end_date: date })}
            disabledDate={(date) =>
              formData.start_date ? date < formData.start_date : false
            }
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabledDate?: (date: Date) => boolean;
}

function DatePickerField({
  label,
  value,
  onChange,
  disabledDate,
}: DatePickerFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-transparent"
          >
            {value
              ? format(value, "dd MMMM yyyy", { locale: localeId })
              : `Pilih ${label.toLowerCase()}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={(date) => onChange(date || null)}
            disabled={disabledDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
