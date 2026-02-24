import { motion } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import { WaxSeal } from "./WaxSeal";
import { useLanguage } from "@/contexts/LanguageContext";
import couplePhoto from "@/assets/couple-1.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-9 max-w-3xl w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mx-auto w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden"
          style={{
            border: "3px solid hsl(var(--gold))",
            boxShadow: "0 0 0 6px hsl(var(--card)), 0 0 0 7px hsl(var(--border) / 0.7)",
          }}
        >
          <img
            src={couplePhoto}
            alt="Bishoy & Arantxa"
            className="w-full h-full object-cover object-[center_20%]"
          />
        </motion.div>

        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-sm tracking-[0.35em] uppercase text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>
          <h1 className="font-script text-[4.6rem] sm:text-[7.5rem] md:text-[8.5rem] gold-text leading-[0.92]">
            Bishoy &amp;
            <br />
            Arantxa
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="ornament-line max-w-3xl mx-auto"
        >
          <span className="text-[2rem] sm:text-[2.1rem] tracking-[0.42em] font-serif text-foreground">
            18 · 07 · 2026
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-sm tracking-[0.28em] uppercase text-muted-foreground"
        >
          {t("hero.location")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <CountdownTimer />
        </motion.div>

        <div className="pt-4">
          <WaxSeal />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-border flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};
