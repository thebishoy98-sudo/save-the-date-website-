import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WEDDING_DATE = new Date("2026-07-18T13:00:00-06:00");

function getTimeLeft() {
  const now = new Date();
  const diff = Math.max(0, WEDDING_DATE.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface FlipDigitProps {
  value: number;
  label: string;
}

const FlipDigit = ({ value, label }: FlipDigitProps) => {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 vintage-card flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          <motion.span
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-2xl sm:text-3xl font-serif font-bold text-foreground absolute"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground font-serif">
        {label}
      </span>
    </div>
  );
};

export const CountdownTimer = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 sm:gap-5 justify-center">
      <FlipDigit value={timeLeft.days} label={t("countdown.days")} />
      <FlipDigit value={timeLeft.hours} label={t("countdown.hours")} />
      <FlipDigit value={timeLeft.minutes} label={t("countdown.minutes")} />
      <FlipDigit value={timeLeft.seconds} label={t("countdown.seconds")} />
    </div>
  );
};
