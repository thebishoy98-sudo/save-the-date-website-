import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

export const GiftsCard = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-6">
      <SectionReveal>
        <div className="max-w-md mx-auto vintage-card rounded-sm p-10 text-center space-y-6">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("gifts.label")}</p>
          <h2 className="font-script text-3xl gold-text">{t("gifts.title")}</h2>
          <div className="w-8 h-px bg-accent mx-auto" />
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-auto text-foreground">
            <rect x="5" y="18" width="30" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="14" width="34" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 14V36" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 14C20 14 14 8 12 6C10 4 12 2 14 4C16 6 20 14 20 14Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 14C20 14 26 8 28 6C30 4 28 2 26 4C24 6 20 14 20 14Z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p className="text-sm text-muted-foreground font-serif leading-relaxed">{t("gifts.message")}</p>
          <div className="pt-2">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{t("gifts.note")}</p>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
};
