import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const MEN_COLORS = ["#1A2744", "#2E2E2E", "#1F3A6E", "#3B2F2F", "#22372B"];
const WOMEN_COLORS = ["#A07B8A", "#6B8F71", "#4A6FA5", "#C4956A", "#8A6EA8"];

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
                <svg width="52" height="72" viewBox="0 0 52 72" fill="none" className="text-foreground">
                  <path d="M26 4 L18 14 L14 68 L38 68 L34 14 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M21 14 L26 23 L31 14" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M26 23 L26 50" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="23" y="9" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              <div className="flex justify-center gap-2">
                {MEN_COLORS.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color, boxShadow: "0 1px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)" }}
                  />
                ))}
              </div>

              <div className="w-8 h-px bg-accent mx-auto" />
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{t("dress.men.desc")}</p>
            </div>

            {/* Ladies */}
            <div className="vintage-card rounded-sm p-8 text-center space-y-5">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("dress.women")}</p>

              <div className="flex justify-center">
                <svg width="52" height="72" viewBox="0 0 52 72" fill="none" className="text-foreground">
                  <path d="M26 4 L21 18 L11 68 L41 68 L31 18 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M21 18 Q26 26 31 18" stroke="currentColor" strokeWidth="1.5" />
                  <ellipse cx="26" cy="5" rx="4" ry="4" stroke="currentColor" strokeWidth="1" />
                  <path d="M16 44 Q26 50 36 44" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex justify-center gap-2">
                {WOMEN_COLORS.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color, boxShadow: "0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                  />
                ))}
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
