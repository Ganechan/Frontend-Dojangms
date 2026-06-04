import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  const highlights = [
    "Pelatih bersertifikasi nasional & internasional",
    "Kurikulum latihan terstruktur berbasis WTF",
    "Lingkungan aman & ramah untuk semua usia",
    "Fasilitas modern dan terawat",
  ];

  return (
    <section id="about" className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-500 rounded" />
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            Tentang Kami
          </span>
          <div className="h-px w-8 bg-red-500 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-gray-900">
          Tentang <span className="text-red-500">Dojang Kami</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-red-500/20 to-orange-400/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/belt-ceremony.jpg"
                alt="Dojang Facility"
                width={560}
                height={420}
                className="object-cover w-full h-full"
              />
              {/* Image overlay badge */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <p className="text-xs text-gray-500 font-medium">Berdiri sejak</p>
                <p className="text-2xl font-black text-red-600">2004</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">
              Sejarah &amp; Visi
            </h3>
            <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-orange-400 rounded mb-6" />

            <p className="text-gray-600 mb-4 leading-relaxed text-base">
              Dojang Joko Tingkir Salatiga didirikan dengan komitmen untuk
              menyebarkan nilai-nilai taekwondo yang luhur kepada masyarakat
              Salatiga dan sekitarnya. Kami percaya bahwa seni bela diri bukan
              hanya tentang fisik, tetapi juga tentang karakter.
            </p>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-4">
              <p className="text-sm font-bold text-red-600 mb-1">Visi</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Membentuk atlet berprestasi dan berkarakter melalui taekwondo
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400 rounded-r-xl p-4 mb-8">
              <p className="text-sm font-bold text-gray-600 mb-1">Misi</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Memberikan pelayanan terbaik, pembinaan profesional, dan
                pengembangan taekwondo untuk semua kalangan
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-red-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
