"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 rounded-3xl px-8 py-16 md:px-16 text-center overflow-hidden shadow-2xl">
          {/* Background orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/80 text-sm font-medium mb-8">
            <Sparkles size={14} className="text-yellow-400" />
            Mulai Perjalananmu
          </div>

          <h2 className="relative text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Mulai Perjalanan{" "}
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Taekwondo
            </span>{" "}
            Anda
          </h2>
          <p className="relative text-white/60 mb-10 max-w-xl mx-auto text-base leading-relaxed">
            Bergabunglah dengan ratusan atlet yang telah merasakan transformasi nyata — fisik, mental, dan karakter — melalui taekwondo.
          </p>

          <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white px-12 py-6 text-base font-bold shadow-2xl shadow-red-900/50 border-0 transition-all duration-300 hover:scale-105 gap-2"
              onClick={() => router.push("/register")}
            >
              Daftar Sekarang
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
