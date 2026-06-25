"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => setEmail(""), 2000);
    }, 1200);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8 text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/20 border border-accent/30">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
              <p className="text-sm font-medium text-accent">Coming Soon</p>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              <span className="text-foreground">Sesuatu yang </span>
              <span className="bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                luar biasa
              </span>
              <span className="text-foreground"> sedang dibangun</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Tim kami sedang bekerja keras untuk menciptakan sesuatu yang
              istimewa. Bersiaplah untuk pengalaman yang akan mengubah semuanya.
            </p>
          </div>

          {/* Status indicator with animation */}
          <div className="flex items-center justify-center gap-2 text-sm text-accent">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Dalam proses pengembangan{dots}</span>
          </div>

          {/* Newsletter signup */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Jadilah yang pertama mengetahui saat kami launching
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isSubmitted}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-muted hover:border-muted-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-75 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {isSubmitted && (
              <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30 animate-in fade-in">
                <p className="text-sm text-accent font-medium">
                  ✓ Terima kasih! Kami akan hubungi Anda segera.
                </p>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="pt-8 border-t border-muted/30">
            <p className="text-xs text-muted-foreground">
              Dibangun dengan passion • Diluncurkan dengan sempurna
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
