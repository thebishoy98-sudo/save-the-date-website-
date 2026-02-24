import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import couple3 from "@/assets/couple-3.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple4 from "@/assets/couple-4.jpg";

interface PhotoBreakProps {
  src: string;
  alt: string;
  caption?: string;
  layout?: "wide" | "offset-left" | "offset-right";
}

const PhotoBreak = ({ src, alt, caption, layout = "wide" }: PhotoBreakProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const parallaxAmount = prefersReducedMotion ? 0 : isMobile ? 12 : 30;
  const y = useTransform(scrollYProgress, [0, 1], [parallaxAmount, -parallaxAmount]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]);
  const imageMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 1.03 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-10% 0px -10% 0px" },
        transition: { duration: isMobile ? 0.5 : 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  if (layout === "wide") {
    return (
      <section ref={ref} className="py-10 sm:py-12 px-4 sm:px-6">
        <SectionReveal>
          <div className="max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl px-2 py-4 sm:px-4 sm:py-6">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-2xl"
                style={{
                  y: bgY,
                  scale: bgScale,
                  background:
                    "radial-gradient(120% 100% at 50% 20%, hsl(var(--accent) / 0.12), transparent 70%), radial-gradient(100% 100% at 50% 100%, hsl(var(--olive) / 0.1), transparent 72%)",
                }}
              />
              <motion.div style={{ y }} className="will-change-transform">
                <motion.img
                  {...imageMotionProps}
                  src={src}
                  alt={alt}
                  className="relative z-10 w-full h-auto max-h-[78svh] object-contain"
                  loading="lazy"
                />
              </motion.div>
            </div>
            {caption && (
              <p className="text-center mt-4 text-xs tracking-[0.22em] sm:tracking-[0.25em] uppercase text-muted-foreground font-serif">
                {caption}
              </p>
            )}
          </div>
        </SectionReveal>
      </section>
    );
  }

  const isLeft = layout === "offset-left";

  return (
    <section ref={ref} className="py-10 sm:py-12 px-4 sm:px-6">
      <SectionReveal>
        <div className={`max-w-3xl mx-auto flex ${isLeft ? "justify-start" : "justify-end"}`}>
          <div className="w-full sm:w-3/5 relative">
            <div className="relative overflow-hidden rounded-2xl px-2 py-4 sm:px-4 sm:py-6">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-2xl"
                style={{
                  y: bgY,
                  scale: bgScale,
                  background:
                    "radial-gradient(120% 100% at 50% 20%, hsl(var(--accent) / 0.12), transparent 70%), radial-gradient(100% 100% at 50% 100%, hsl(var(--olive) / 0.1), transparent 72%)",
                }}
              />
              <motion.div style={{ y }} className="will-change-transform">
                <motion.img
                  {...imageMotionProps}
                  src={src}
                  alt={alt}
                  className="relative z-10 w-full h-auto max-h-[70svh] object-contain"
                  loading="lazy"
                />
              </motion.div>
            </div>
            {caption && (
              <motion.p
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                viewport={{ once: true }}
                className={`mt-4 text-xs tracking-[0.22em] sm:tracking-[0.25em] uppercase text-muted-foreground font-serif ${
                  isMobile ? "text-center" : isLeft ? "text-left pl-1" : "text-right pr-1"
                }`}
              >
                {caption}
              </motion.p>
            )}
            {!isMobile && (
              <div
                className={`absolute -z-10 w-24 h-24 bg-accent/10 blur-2xl rounded-full ${
                  isLeft ? "-right-3 -bottom-3" : "-left-3 -bottom-3"
                }`}
              />
            )}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
};

export const PhotoBreak1 = () => {
  const { t } = useLanguage();
  return (
    <PhotoBreak
      src={couple3}
      alt="Arantxa & Bishoy"
      layout="offset-right"
      caption={t("events.label") === "Event Details" ? "Our Journey Together" : "Nuestro Camino Juntos"}
    />
  );
};

export const PhotoBreak2 = () => {
  const { t } = useLanguage();
  return (
    <PhotoBreak
      src={couple2}
      alt="Arantxa & Bishoy"
      layout="offset-left"
      caption={t("events.label") === "Event Details" ? "Love in Every Step" : "Amor en Cada Paso"}
    />
  );
};

export const PhotoBreak3 = () => {
  const { t } = useLanguage();
  return (
    <PhotoBreak
      src={couple4}
      alt="Arantxa & Bishoy"
      layout="wide"
      caption={t("events.label") === "Event Details" ? "Forever Begins" : "Para Siempre Comienza"}
    />
  );
};
