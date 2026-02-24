import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  if (layout === "wide") {
    return (
      <section ref={ref} className="py-12 px-6">
        <SectionReveal>
          <div className="max-w-2xl mx-auto">
            <div
              className="overflow-hidden rounded-sm"
              style={{
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 20px 60px hsl(var(--olive) / 0.08)",
              }}
            >
              <motion.div style={{ y }} className="will-change-transform">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </motion.div>
            </div>
            {caption && (
              <p className="text-center mt-4 text-xs tracking-[0.25em] uppercase text-muted-foreground font-serif">
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
    <section ref={ref} className="py-12 px-6">
      <SectionReveal>
        <div className={`max-w-3xl mx-auto flex ${isLeft ? "justify-start" : "justify-end"}`}>
          <div className="w-full sm:w-3/5 relative">
            <div
              className="overflow-hidden rounded-sm"
              style={{
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 20px 60px hsl(var(--olive) / 0.08)",
              }}
            >
              <motion.div style={{ y }} className="will-change-transform">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </motion.div>
            </div>
            {caption && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
                className={`mt-4 text-xs tracking-[0.25em] uppercase text-muted-foreground font-serif ${isLeft ? "text-left pl-1" : "text-right pr-1"}`}
              >
                {caption}
              </motion.p>
            )}
            {/* Decorative corner accent */}
            <div
              className={`absolute -z-10 w-24 h-24 border border-accent/30 ${
                isLeft ? "-right-3 -bottom-3" : "-left-3 -bottom-3"
              }`}
              style={{ borderRadius: "var(--radius)" }}
            />
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
      alt="Bishoy & Arantxa"
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
      alt="Bishoy & Arantxa"
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
      alt="Bishoy & Arantxa"
      layout="wide"
      caption={t("events.label") === "Event Details" ? "Forever Begins" : "Para Siempre Comienza"}
    />
  );
};
