"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 10, suffix: "+", label: "Tahun Berdiri", icon: "🏛️" },
  { value: 200, suffix: "+", label: "Anggota Aktif", icon: "👥" },
  { value: 10, suffix: "+", label: "Sabuk Hitam", icon: "🥋" },
  { value: 100, suffix: "+", label: "Prestasi", icon: "🏆" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ stat, animate }: { stat: typeof stats[0]; animate: boolean }) {
  const count = useCountUp(stat.value, 2000, animate);
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
      <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300">
        <div className="text-4xl mb-3">{stat.icon}</div>
        <div className="text-5xl font-black text-white mb-2 tabular-nums">
          {count}
          <span className="text-red-400">{stat.suffix}</span>
        </div>
        <p className="text-white/70 text-sm font-medium tracking-wide">{stat.label}</p>
      </div>
    </div>
  );
}

export default function StatisticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-gray-950 via-red-950 to-gray-950">
      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-400 rounded" />
          <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">
            Pencapaian Kami
          </span>
          <div className="h-px w-8 bg-red-400 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-4">
          Statistik <span className="text-red-400">Dojang</span>
        </h2>
        <p className="text-white/50 text-center mb-16 max-w-md mx-auto">
          Angka-angka yang mencerminkan dedikasi dan perjalanan kami selama lebih dari satu dekade.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}
