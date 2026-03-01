import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

export const OurStory = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 sm:py-12 px-6">
      <SectionReveal>
        <div className="max-w-2xl mx-auto">
          <div className="vintage-card rounded-sm p-10 sm:p-14 text-center space-y-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("story.label")}</p>
              <h2 className="font-script text-4xl gold-text">{t("story.title")}</h2>
            </div>

            <div className="w-16 h-px bg-accent mx-auto" />

            <div className="space-y-5 text-muted-foreground leading-relaxed text-base">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
};
