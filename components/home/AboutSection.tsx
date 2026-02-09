import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Tentang Dojang Kami
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              Sejarah & Visi
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Dojang Joko Tingkir Salatiga didirikan dengan komitmen untuk
              menyebarkan nilai-nilai taekwondo yang luhur kepada masyarakat
              Salatiga dan sekitarnya.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>Visi:</strong> Membentuk atlet berprestasi dan berkarakter
              melalui taekwondo
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Misi:</strong> Memberikan pelayanan terbaik, pembinaan
              profesional, dan pengembangan taekwondo untuk semua kalangan
            </p>
          </div>
          <div>
            <Image
              src="/belt-ceremony.jpg"
              alt="Dojang Facility"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
