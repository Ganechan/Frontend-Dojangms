"use client";

import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "info",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const iconBgColor =
    variant === "danger"
      ? "bg-red-100"
      : variant === "warning"
        ? "bg-yellow-100"
        : "bg-blue-100";
  const iconColor =
    variant === "danger"
      ? "text-red-600"
      : variant === "warning"
        ? "text-yellow-600"
        : "text-blue-600";
  const buttonColor =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : variant === "warning"
        ? "bg-yellow-600 hover:bg-yellow-700"
        : "bg-blue-600 hover:bg-blue-700";

  const Icon = variant === "danger" ? AlertTriangle : AlertCircle;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Icon */}
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}
        >
          <Icon className={iconColor} size={24} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>

        {/* Message */}
        <p className="text-muted-foreground mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className={`${buttonColor} text-white`} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  isOpen: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  isOpen,
  message,
  type,
  onClose,
  duration = 4000,
}: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200"
      : type === "error"
        ? "bg-red-50 border-red-200"
        : type === "warning"
          ? "bg-yellow-50 border-yellow-200"
          : "bg-blue-50 border-blue-200";

  const textColor =
    type === "success"
      ? "text-green-800"
      : type === "error"
        ? "text-red-800"
        : type === "warning"
          ? "text-yellow-800"
          : "text-blue-800";

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
        ? AlertCircle
        : type === "warning"
          ? AlertTriangle
          : AlertCircle;

  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} border rounded-lg p-4 flex items-center gap-3 shadow-lg z-50 max-w-md`}
    >
      <Icon className={textColor} size={24} />
      <p className={`${textColor} text-sm font-medium`}>{message}</p>
    </div>
  );
}
