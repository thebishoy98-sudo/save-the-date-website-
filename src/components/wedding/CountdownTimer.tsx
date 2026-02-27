import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

const FlipDigit = memo(({ value, label }: FlipDigitProps) => {
  const display = String(value).padStart(2, "0");
  const [pulse, setPulse] = useState(0);
  const firstPaint = useRef(true);

  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    setPulse((n) => n + 1);
  }, [display]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-16 sm:w-20 sm:h-24 vintage-card flex items-center justify-center overflow-hidden">
        <motion.span
          animate={
            pulse === 0
              ? { y: 0, opacity: 1 }
              : { y: [-5, 0], opacity: [0.72, 1] }
          }
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl sm:text-3xl font-serif font-bold text-foreground absolute tabular-nums will-change-transform"
        >
          {display}
        </motion.span>
      </div>
      <span className="mt-2 text-[10px] sm:text-sm tracking-[0.12em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
        {label}
      </span>
    </div>
  );
});

export const CountdownTimer = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap gap-2 sm:gap-5 justify-center">
      <FlipDigit value={timeLeft.days} label={t("countdown.days")} />
      <FlipDigit value={timeLeft.hours} label={t("countdown.hours")} />
      <FlipDigit value={timeLeft.minutes} label={t("countdown.minutes")} />
      <FlipDigit value={timeLeft.seconds} label={t("countdown.seconds")} />
    </div>
  );
};
