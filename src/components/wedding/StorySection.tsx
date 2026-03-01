import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

export const StorySection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 sm:py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionReveal>
          <div className="vintage-card rounded-sm p-6 sm:p-10 text-center space-y-5">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("story.label")}</p>
            <h2 className="font-script text-4xl gold-text">{t("story.title")}</h2>
            <p className="text-sm sm:text-base text-muted-foreground font-serif leading-relaxed whitespace-pre-line">
              {t("story.body")}
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
