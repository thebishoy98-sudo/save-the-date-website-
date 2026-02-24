import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import churchImg from "@/assets/church.jpg";
import venueImg from "@/assets/venue.jpg";

export const EventSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <SectionReveal>
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("events.label")}</p>
            <h2 className="font-script text-4xl gold-text">{t("events.title")}</h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-8">
          <SectionReveal delay={0.15}>
            <div className="vintage-card rounded-sm overflow-hidden h-full">
              <div className="overflow-hidden">
                <img src={churchImg} alt="Iglesia Copta Ortodoxa" className="w-full h-auto" loading="lazy" />
              </div>
              <div className="p-3 sm:p-8 text-center space-y-2 sm:space-y-4">
                <h3 className="text-[11px] sm:text-lg font-serif tracking-[0.1em] sm:tracking-[0.15em] uppercase text-foreground">
                  {t("events.ceremony")}
                </h3>
                <div className="w-8 h-px bg-accent mx-auto" />
                <p className="font-script text-lg sm:text-2xl gold-text">1:00 pm</p>
                <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed font-serif">
                  {t("events.ceremony.venue")}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-serif">
                  {t("events.ceremony.address")}
                </p>
                <a
                  href="https://maps.google.com/?q=Orthodox+Coptic+Church+of+Our+Lady+of+Guadalupe+and+Saint+Mark,+Carr+Yautepec-Tlayacapan+25,+Barrio+de+Texcalpan,+62540+Tlayacapan,+Mor."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase font-serif text-accent hover:text-foreground transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {t("events.label") === "Event Details" ? "View Map" : "Ver Mapa"}
                </a>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <div className="vintage-card rounded-sm overflow-hidden h-full">
              <div className="overflow-hidden">
                <img src={venueImg} alt="El Suspiro Tepoztlán" className="w-full h-auto" loading="lazy" />
              </div>
              <div className="p-3 sm:p-8 text-center space-y-2 sm:space-y-4">
                <h3 className="text-[11px] sm:text-lg font-serif tracking-[0.1em] sm:tracking-[0.15em] uppercase text-foreground">
                  {t("events.reception")}
                </h3>
                <div className="w-8 h-px bg-accent mx-auto" />
                <p className="font-script text-lg sm:text-2xl gold-text">4:00 pm</p>
                <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed font-serif">
                  {t("events.reception.venue")}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-serif">
                  {t("events.reception.address")}
                </p>
                <a
                  href="https://maps.google.com/?q=El+Suspiro+Tepoztlan,+Carretera+Cuernavaca-Tepoztlán+16.5+Barrio,+Col+del+Tesoro,+62520+Tepoztlán,+Mor."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase font-serif text-accent hover:text-foreground transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {t("events.label") === "Event Details" ? "View Map" : "Ver Mapa"}
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};
