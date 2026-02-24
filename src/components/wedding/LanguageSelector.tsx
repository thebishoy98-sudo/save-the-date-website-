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
            {/* Decorative top */}
            <div className="space-y-3">
              <p className="font-script text-4xl sm:text-5xl gold-text">B & A</p>
              <div className="w-16 h-px bg-border mx-auto" />
            </div>

            <div className="space-y-2">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-serif">
                Elige tu idioma / Choose your language
              </p>
            </div>

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
              18 · 07 · 2026 — Tepoztlán, Morelos
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
