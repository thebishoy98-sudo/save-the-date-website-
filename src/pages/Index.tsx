import { useEffect, useState } from "react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/wedding/LanguageSelector";
import { HeroSection } from "@/components/wedding/HeroSection";
import { EnvelopeReveal } from "@/components/wedding/EnvelopeReveal";
import { EventSection } from "@/components/wedding/EventSection";
import { DressCodeCard } from "@/components/wedding/DressCodeCard";
import { GiftsCard } from "@/components/wedding/GiftsCard";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { HotelSection } from "@/components/wedding/HotelSection";
import { PhotoBreak1, PhotoBreak3 } from "@/components/wedding/PhotoBreak";
import { OurStory } from "@/components/wedding/OurStory";
import { LocationMap } from "@/components/wedding/LocationMap";
import { SuggestedFlights } from "@/components/wedding/SuggestedFlights";
import { ExperienceMotion } from "@/components/wedding/ExperienceMotion";

const WeddingContent = () => {
  const { t, lang } = useLanguage();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        setShowOverlay((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-background relative">
      <div className="page-vignette" aria-hidden />
      <ExperienceMotion />
      {showOverlay && (
        <div className="fixed inset-0 z-50 pointer-events-none opacity-50 bg-accent/10 flex items-center justify-center">
          <p className="text-foreground text-sm font-serif">
            {lang === "es" ? "Superposicion de referencia (Presiona R para ocultar)" : "Reference Overlay (Press R to hide)"}
          </p>
        </div>
      )}

      <div className="book-page">
        <LanguageSelector />
        <HeroSection />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <EnvelopeReveal />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <OurStory />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <EventSection />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <LocationMap />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <SuggestedFlights />

        <PhotoBreak1 />

        <DressCodeCard />

        <GiftsCard />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <HotelSection />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <PhotoBreak3 />

        <div className="ornament-line max-w-xs mx-auto px-6">
          <span className="text-sm gold-text">.</span>
        </div>

        <RSVPForm />

        <footer className="py-10 sm:py-12 text-center">
          <p className="font-script text-2xl gold-text mb-2">Arantxa & Bishoy</p>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">
            {t("footer.date")}
          </p>
        </footer>
      </div>
    </main>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <WeddingContent />
    </LanguageProvider>
  );
};

export default Index;
