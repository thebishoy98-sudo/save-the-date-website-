import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { lang, setLang } = useLanguage();
  const [show, setShow] = useState(true);

  const handleSelect = (selected: "es" | "en") => {
    setLang(selected);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-10 px-6"
          >
            {/* Monogram crest */}
            <div className="flex flex-col items-center gap-1">
              {/* Top ornamental rule */}
              <div className="flex items-center gap-2">
                <div className="w-14 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.6))" }} />
                <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
                  <polygon points="4,0 6,4 4,8 2,4" fill="hsl(var(--accent))" opacity="0.7"/>
                </svg>
                <div className="w-14 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.6), transparent)" }} />
              </div>

              {/* A ✦ B */}
              <div className="flex items-center" style={{ gap: "10px" }}>
                <span className="font-script gold-text leading-none select-none" style={{ fontSize: "5.5rem" }}>A</span>

                {/* Center ornament */}
                <div className="flex flex-col items-center" style={{ gap: "4px", paddingBottom: "6px" }}>
                  <div style={{ width: "0.5px", height: "14px", background: "hsl(var(--gold) / 0.35)" }} />
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                    <polygon points="5,0 6.5,5 5,10 3.5,5" fill="hsl(var(--accent))" opacity="0.55"/>
                    <polygon points="0,5 5,3.5 10,5 5,6.5" fill="hsl(var(--accent))" opacity="0.55"/>
                  </svg>
                  <div style={{ width: "0.5px", height: "14px", background: "hsl(var(--gold) / 0.35)" }} />
                </div>

                <span className="font-script gold-text leading-none select-none" style={{ fontSize: "5.5rem" }}>B</span>
              </div>

              {/* Bottom ornamental rule */}
              <div className="flex items-center gap-2 -mt-2">
                <div className="w-14 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.6))" }} />
                <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
                  <polygon points="4,0 6,4 4,8 2,4" fill="hsl(var(--accent))" opacity="0.7"/>
                </svg>
                <div className="w-14 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.6), transparent)" }} />
              </div>
            </div>

            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-serif">
              Elige tu idioma / Choose your language
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleSelect("es")}
                className="px-10 py-4 vintage-card rounded-sm font-serif text-sm tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg text-foreground"
                style={{
                  borderColor: lang === "es" ? "hsl(var(--accent))" : undefined,
                }}
              >
                🇲🇽 Español
              </button>
              <button
                onClick={() => handleSelect("en")}
                className="px-10 py-4 vintage-card rounded-sm font-serif text-sm tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg text-foreground"
                style={{
                  borderColor: lang === "en" ? "hsl(var(--accent))" : undefined,
                }}
              >
                🇺🇸 English
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-serif">
              July 18, 2026 — Tepoztlán, Morelos
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
