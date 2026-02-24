import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const EnvelopeReveal = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => setShowContent(true), 1600);
  };

  return (
    <section className="py-20 px-6 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative cursor-pointer select-none"
            onClick={handleOpen}
            style={{ perspective: "800px" }}
          >
            <div className="relative w-72 sm:w-96 h-48 sm:h-60">
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 8px 40px hsl(var(--olive) / 0.1)",
                }}
              />
              <motion.div
                animate={isOpen ? { y: -120 } : { y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-4 top-4 bottom-4 rounded-sm flex flex-col items-center justify-center text-center p-6"
                style={{
                  background: "hsl(var(--parchment))",
                  border: "1px solid hsl(var(--border))",
                  zIndex: 1,
                }}
              >
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("envelope.label")}</p>
                <p className="font-script text-2xl sm:text-3xl gold-text mb-2">Arantxa & Bishoy</p>
                <div className="w-12 h-px bg-border my-3" />
                <p className="text-sm text-muted-foreground font-serif">{t("envelope.request")}</p>
                <p className="text-sm text-muted-foreground font-serif">{t("envelope.ceremony")}</p>
              </motion.div>
              <div
                className="absolute inset-x-0 bottom-0 h-[55%] rounded-b-sm"
                style={{
                  background: "hsl(var(--card))",
                  zIndex: 2,
                  clipPath: "polygon(0 40%, 50% 0%, 100% 40%, 100% 100%, 0 100%)",
                }}
              />
              <motion.div
                animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-0 h-[55%]"
                style={{ transformOrigin: "top center", transformStyle: "preserve-3d", zIndex: 3 }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: "hsl(var(--card))",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    border: "1px solid hsl(var(--border))",
                    backfaceVisibility: "hidden",
                  }}
                />
              </motion.div>
              {!isOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full z-[4] gold-shimmer flex items-center justify-center"
                  style={{ top: "52%", boxShadow: "0 2px 8px hsl(var(--gold) / 0.3)" }}
                >
                  <div className="w-[80%] h-[80%] rounded-full flex items-center justify-center" style={{ background: "hsl(var(--seal))" }}>
                    <span className="font-script text-xs text-parchment">A&B</span>
                  </div>
                </div>
              )}
            </div>
            {!isOpen && (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center mt-6 text-sm text-muted-foreground tracking-wide"
              >
                {t("envelope.tap")}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-lg space-y-6"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("envelope.blessing")}</p>
            <h2 className="font-script text-4xl sm:text-5xl gold-text">Arantxa & Bishoy</h2>
            <p className="text-base text-foreground leading-relaxed font-serif">{t("envelope.honor")}</p>
            <p className="text-2xl font-serif tracking-[0.15em] text-foreground">{t("envelope.date")}</p>
            <p className="text-base text-foreground font-serif">{t("envelope.place")}</p>
            <div className="ornament-line pt-4">
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("envelope.details")}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
