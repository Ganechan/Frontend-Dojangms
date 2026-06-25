"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Shield, Award } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="/bg.jpg"
        alt="Taekwondo Athletes Training"
        fill
        className="object-cover scale-105"
        priority
      />

      {/* Layered Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-red-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm font-medium text-white/90 animate-fade-in">
          <Shield size={14} className="text-red-400" />
          <span>Salatiga, Jawa Tengah · Berdiri 2015</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
          <span className="block text-white drop-shadow-2xl">Dojang</span>
          <span className="block bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
            Joko Tingkir
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-4 text-white/80 font-light tracking-wide">
          Membangun Karakter Melalui Seni Bela Diri
        </p>
        <p className="text-base md:text-lg mb-12 text-white/50 max-w-xl mx-auto">
          Bergabunglah dengan komunitas taekwondo terpercaya dan raih prestasi terbaik bersama kami.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 px-10 py-6 text-base font-bold shadow-2xl shadow-red-900/50 border-0 transition-all duration-300 hover:scale-105 hover:shadow-red-800/60"
            onClick={() => router.push("/register")}
          >
            🥋 Daftar Latihan
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-10 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:border-white/60"
            onClick={() => {
              const el = document.getElementById("contact");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Hubungi Kami
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: "200+", label: "Anggota" },
            { value: "10+", label: "Tahun" },
            { value: "100+", label: "Prestasi" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-4 px-2"
            >
              <div className="text-2xl font-black text-red-400">{s.value}</div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
}
