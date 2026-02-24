import { useRef } from "react";
import { useInView } from "framer-motion";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const SuitIcon = ({ animate }: { animate: boolean }) => (
  <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="text-foreground">
    <path d="M30 5 L20 15 L15 75 L45 75 L40 15 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      style={{ strokeDasharray: 300, strokeDashoffset: animate ? 0 : 300, transition: "stroke-dashoffset 1.5s ease-in-out" }} />
    <path d="M24 15 L30 25 L36 15" stroke="currentColor" strokeWidth="1.5"
      style={{ strokeDasharray: 300, strokeDashoffset: animate ? 0 : 300, transition: "stroke-dashoffset 1.5s ease-in-out 0.3s" }} />
    <path d="M30 25 L30 55" stroke="currentColor" strokeWidth="1.5"
      style={{ strokeDasharray: 300, strokeDashoffset: animate ? 0 : 300, transition: "stroke-dashoffset 1.5s ease-in-out 0.5s" }} />
  </svg>
);

const DressIcon = ({ animate }: { animate: boolean }) => (
  <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="text-foreground">
    <path d="M30 5 L25 20 L15 75 L45 75 L35 20 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      style={{ strokeDasharray: 300, strokeDashoffset: animate ? 0 : 300, transition: "stroke-dashoffset 1.5s ease-in-out" }} />
    <path d="M25 20 Q30 28 35 20" stroke="currentColor" strokeWidth="1.5"
      style={{ strokeDasharray: 300, strokeDashoffset: animate ? 0 : 300, transition: "stroke-dashoffset 1.5s ease-in-out 0.4s" }} />
    <path d="M20 45 Q30 50 40 45" stroke="currentColor" strokeWidth="1.5"
      style={{ strokeDasharray: 300, strokeDashoffset: animate ? 0 : 300, transition: "stroke-dashoffset 1.5s ease-in-out 0.7s" }} />
  </svg>
);

export const DressCodeCard = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 px-6" ref={ref}>
      <SectionReveal>
        <div className="max-w-md mx-auto vintage-card rounded-sm p-10 text-center space-y-6">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("dress.label")}</p>
          <h2 className="font-script text-3xl gold-text">{t("dress.title")}</h2>
          <div className="w-8 h-px bg-accent mx-auto" />
          <div className="flex justify-center gap-12 py-4">
            <div className="flex flex-col items-center gap-2">
              <SuitIcon animate={isInView} />
              <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">{t("dress.men")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DressIcon animate={isInView} />
              <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">{t("dress.women")}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-serif leading-relaxed">{t("dress.note")}</p>
        </div>
      </SectionReveal>
    </section>
  );
};
