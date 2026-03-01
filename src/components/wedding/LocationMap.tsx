import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import mapEnglish from "@/assets/Maps.jpg";
import mapSpanish from "@/assets/Maps_spasnsh.jpg";

export const LocationMap = () => {
  const { t, lang } = useLanguage();
  const isEs = lang === "es";

  return (
    <section className="py-10 sm:py-12 px-6">
      <SectionReveal>
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("location.label")}</p>
            {!isEs && <h2 className="font-script text-4xl gold-text">{t("location.title")}</h2>}
          </div>

          {/* Language-specific route map image */}
          <div className="rounded-sm overflow-hidden border border-border">
            <img
              src={isEs ? mapSpanish : mapEnglish}
              alt={isEs ? "Mapa de ubicaciones y ruta" : "Map of key locations and driving route"}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>

          {/* Airport distance cards */}
          <div className={`grid gap-4 ${isEs ? "grid-cols-1" : "grid-cols-2"}`}>
            <div className="vintage-card rounded-sm p-6 text-center space-y-3">
              <div className="text-2xl font-serif tracking-widest text-foreground">MEX</div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                {isEs ? "Aeropuerto de llegada" : "Mexico City Airport"}
              </p>
              <div className="w-8 h-px bg-accent mx-auto" />
              <p className="font-script text-xl gold-text">{isEs ? "~90 km" : "~56 mi"}</p>
              <p className="text-sm text-muted-foreground">
                {isEs ? "aprox. 1h 30min en auto" : "approx. 1h 30min by car"}
              </p>
            </div>

            {!isEs && (
              <div className="vintage-card rounded-sm p-6 text-center space-y-3">
                <div className="text-2xl font-serif tracking-widest text-foreground">PBC</div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Puebla Airport</p>
                <div className="w-8 h-px bg-accent mx-auto" />
                <p className="font-script text-xl gold-text">~71 mi</p>
                <p className="text-sm text-muted-foreground">approx. 2h by car</p>
              </div>
            )}
          </div>

          {/* Key message */}
          <div className="vintage-card rounded-sm px-8 py-5 text-center space-y-2">
            <p className="text-xs tracking-[0.25em] uppercase gold-text mb-1">
              {isEs ? "Importante" : "Important"}
            </p>
            <p className="text-base text-foreground leading-relaxed">
              {t("location.note")}
            </p>
          </div>

        </div>
      </SectionReveal>
    </section>
  );
};
