import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const galleryItems = [
  { title: "Latihan Rutin Harian", emoji: "🥋", span: "lg:col-span-2" },
  { title: "Ujian Sabuk", emoji: "🎽", span: "" },
  { title: "Kompetisi Tingkat Kota", emoji: "🏆", span: "" },
  { title: "Acara Poomsae", emoji: "🎯", span: "" },
  { title: "Gathering Taekwondo", emoji: "👥", span: "lg:col-span-2" },
  { title: "Pembukaan Cabang Baru", emoji: "🎊", span: "" },
];

const gradients = [
  "from-red-600 via-red-700 to-rose-800",
  "from-orange-500 via-amber-600 to-orange-700",
  "from-slate-700 via-gray-800 to-slate-900",
  "from-red-800 via-red-900 to-rose-950",
  "from-amber-600 via-orange-700 to-red-700",
  "from-gray-700 via-slate-800 to-gray-900",
];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-24 px-4 bg-gray-950 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-400 rounded" />
          <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">
            Dokumentasi
          </span>
          <div className="h-px w-8 bg-red-400 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4">
          Galeri <span className="text-red-400">Kegiatan</span>
        </h2>
        <p className="text-white/50 text-center mb-16 max-w-md mx-auto">
          Sekilas momen berharga dari perjalanan dan kegiatan Dojang Joko Tingkir.
        </p>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`group relative h-52 bg-gradient-to-br ${gradients[index]} rounded-2xl overflow-hidden cursor-pointer ${item.span}`}
            >
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400" />

              {/* Emoji watermark */}
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 select-none">
                {item.emoji}
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white font-bold text-sm">{item.title}</p>
              </div>

              {/* Always-visible label bottom */}
              <div className="absolute bottom-4 left-4">
                <span className="text-white/60 text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full group-hover:opacity-0 transition-opacity duration-200">
                  {item.emoji} {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm px-8 font-semibold gap-2 transition-all duration-300 hover:border-red-400 hover:text-red-400"
          >
            <ExternalLink size={16} />
            Lihat Galeri Lengkap
          </Button>
        </div>
      </div>
    </section>
  );
}
