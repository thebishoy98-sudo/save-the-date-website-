import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import suitIcon from "@/assets/dresscode-suit.jpg";
import dressIcon from "@/assets/dresscode-dress.jpg";

export const DressCodeCard = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-6">
      <SectionReveal>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("dress.label")}</p>
            <h2 className="font-script text-4xl gold-text mt-2">{t("dress.title")}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Gentlemen */}
            <div className="vintage-card rounded-sm p-8 text-center space-y-5">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("dress.men")}</p>

              <div className="flex justify-center">
                <img src={suitIcon} alt="Suit icon" className="w-14 h-20 text-foreground" loading="lazy" />
              </div>

              <div className="w-8 h-px bg-accent mx-auto" />
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{t("dress.men.desc")}</p>
            </div>

            {/* Ladies */}
            <div className="vintage-card rounded-sm p-8 text-center space-y-5">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("dress.women")}</p>

              <div className="flex justify-center">
                <img src={dressIcon} alt="Dress icon" className="w-14 h-20 text-foreground" loading="lazy" />
              </div>

              <div className="w-8 h-px bg-accent mx-auto" />
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{t("dress.women.desc")}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 vintage-card rounded-sm px-6 py-3 max-w-sm mx-auto">
            <span className="gold-text flex-shrink-0">✦</span>
            <p className="text-sm text-muted-foreground font-serif text-center">{t("dress.note")}</p>
            <span className="gold-text flex-shrink-0">✦</span>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
};
