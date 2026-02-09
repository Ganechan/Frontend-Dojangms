"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      <Image
        src="/bg.jpg"
        alt="Taekwondo Athletes Training"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
          Dojang Joko Tingkir
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Membangun Karakter Melalui Seni Bela Diri
        </p>
        <p className="text-lg mb-8 text-gray-300">Salatiga, Jawa Tengah</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 px-8"
            onClick={() => router.push("/register")}
          >
            Daftar Latihan
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20 bg-transparent"
            onClick={() => router.push("/")}
          >
            Hubungi Kami
          </Button>
        </div>
      </div>
    </section>
  );
}
