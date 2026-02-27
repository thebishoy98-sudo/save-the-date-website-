import { motion } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import { useLanguage } from "@/contexts/LanguageContext";
import couplePhoto from "@/assets/couple-1.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-60"
          style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.07) 0%, transparent 68%)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-40"
          style={{ background: "radial-gradient(ellipse, hsl(var(--olive) / 0.05) 0%, transparent 70%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center space-y-7 sm:space-y-9 max-w-3xl w-full relative z-10 mt-10 sm:mt-16"
      >
        {/* Photo with triple-ring frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mx-auto w-52 h-52 sm:w-64 sm:h-64"
        >
          {/* Outer gold glow ring */}
          <div className="absolute inset-0 rounded-full gold-shimmer opacity-70"
            style={{ padding: "2px", boxShadow: "0 0 28px hsl(var(--gold) / 0.25)" }}>
            <div className="w-full h-full rounded-full" style={{ background: "hsl(var(--card))" }} />
          </div>
          {/* Spacer ring */}
          <div className="absolute inset-[6px] rounded-full"
            style={{ border: "1px solid hsl(var(--border) / 0.7)" }} />
          {/* Photo */}
          <div className="absolute inset-[10px] rounded-full overflow-hidden">
            <img
              src={couplePhoto}
              alt="Arantxa & Bishoy"
              className="w-full h-full object-cover object-[center_20%]"
            />
          </div>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xs sm:text-sm tracking-[0.22em] sm:tracking-[0.35em] uppercase text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>
          <h1 className="mt-1 sm:mt-2 font-script text-[3.3rem] sm:text-[7.5rem] md:text-[8.5rem] gold-text leading-[0.96]">
            Arantxa &amp;
            <br />
            Bishoy
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="ornament-line max-w-3xl mx-auto"
        >
          <span className="text-[1.2rem] sm:text-[2.1rem] tracking-[0.12em] sm:tracking-[0.18em] font-serif text-foreground whitespace-nowrap uppercase">
            July 18, 2026
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.28em] uppercase text-muted-foreground"
        >
          {t("hero.location")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <CountdownTimer />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
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
