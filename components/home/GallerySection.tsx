import { Button } from "@/components/ui/button";

export default function GallerySection() {
  const galleryItems = [
    "Latihan Rutin Harian",
    "Ujian Sabuk",
    "Kompetisi Tingkat Kota",
    "Acara Poomsae",
    "Gathering Taekwondo",
    "Pembukaan Cabang Baru",
  ];

  return (
    <section id="gallery" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Galeri</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((title, index) => (
            <div
              key={index}
              className="relative h-64 bg-gradient-to-br from-primary to-primary/50 rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                <span className="text-white font-semibold text-center px-4">
                  {title}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
          >
            Lihat Galeri Lengkap
          </Button>
        </div>
      </div>
    </section>
  );
}
