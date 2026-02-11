"use client";

import Header from "@/components/landing-page/Header";
import HeroSection from "@/components/landing-page/HeroSection";
import AboutSection from "@/components/landing-page/AboutSection";
import StatisticsSection from "@/components/landing-page/StatisticsSection";
import ProgramsSection from "@/components/landing-page/ProgramsSection";
import FacilitiesSection from "@/components/landing-page/FacilitiesSection";
import AchievementsSection from "@/components/landing-page/AchievementsSection";
import ScheduleSection from "@/components/landing-page/ScheduleSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import GallerySection from "@/components/landing-page/GallerySection";
import CTASection from "@/components/landing-page/CTASection";
import ContactSection from "@/components/landing-page/ContactSection";
import FloatingWhatsApp from "@/components/landing-page/Floatingwhatsapp";
import Footer from "@/components/landing-page/Footer";

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
