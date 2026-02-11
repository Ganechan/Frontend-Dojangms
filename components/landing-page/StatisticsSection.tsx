export default function StatisticsSection() {
  const stats = [
    { value: "20+", label: "Tahun Berdiri" },
    { value: "300+", label: "Anggota Aktif" },
    { value: "50+", label: "Sabuk Hitam" },
    { value: "100+", label: "Prestasi" },
  ];

  return (
    <section className="py-20 px-4 bg-primary text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Statistik Dojang
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-white/10 rounded-lg backdrop-blur"
            >
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <p className="text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
