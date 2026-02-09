"use client";

import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import AchievementsSection from "@/components/home/AchievementsSection";
import ScheduleSection from "@/components/home/ScheduleSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GallerySection from "@/components/home/GallerySection";
import CTASection from "@/components/home/CTASection";
import ContactSection from "@/components/home/ContactSection";
import FloatingWhatsApp from "@/components/home/Floatingwhatsapp";
import Footer from "@/components/home/Footer";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header scrollToSection={scrollToSection} />
      <HeroSection />
      <AboutSection />
      <StatisticsSection />
      <ProgramsSection />
      <FacilitiesSection />
      <AchievementsSection />
      <ScheduleSection />
      <TestimonialsSection />
      <GallerySection />
      <CTASection />
      <ContactSection />
      <FloatingWhatsApp />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}
