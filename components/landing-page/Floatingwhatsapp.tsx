"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/628123456789?text=Halo%20Dojang%20Joko%20Tingkir%20Salatiga"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-8 right-8 z-50 flex items-center gap-0 hover:gap-3 overflow-hidden bg-green-500 hover:bg-green-500 text-white rounded-full shadow-2xl shadow-green-900/40 hover:shadow-green-900/60 transition-all duration-300 hover:pr-5 p-4"
      aria-label="Chat WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />

      <MessageCircle size={24} className="relative flex-shrink-0" />
      <span className="relative max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300">
        Chat WhatsApp
      </span>
    </a>
  );
}
