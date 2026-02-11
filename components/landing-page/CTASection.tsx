"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-20 px-4 bg-primary text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Mulai Perjalanan Taekwondo Anda Bersama Kami
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Bergabunglah dengan ribuan atlet yang telah merasakan transformasi
          melalui taekwondo
        </p>
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-gray-100 px-12 font-bold text-lg"
          onClick={() => router.push("/register")}
        >
          Daftar Sekarang
        </Button>
      </div>
    </section>
  );
}
