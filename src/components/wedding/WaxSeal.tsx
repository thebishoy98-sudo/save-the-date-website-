import { motion } from "framer-motion";

export const WaxSeal = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto"
    >
      {/* Gold shimmer outer ring */}
      <div
        className="w-full h-full rounded-full gold-shimmer flex items-center justify-center"
        style={{
          boxShadow: "0 4px 24px hsl(var(--gold) / 0.35), inset 0 1px 2px hsl(var(--gold-light) / 0.5)",
        }}
      >
        {/* Inner wax body */}
        <div
          className="relative w-[86%] h-[86%] rounded-full flex flex-col items-center justify-center gap-1"
          style={{
            background: "radial-gradient(circle at 35% 35%, hsl(var(--seal-light)), hsl(var(--seal)))",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.35)",
          }}
        >
          {/* Decorative dashed ring */}
          <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full opacity-25" aria-hidden>
            <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--parchment))" strokeWidth="0.8" strokeDasharray="3 3.5" />
            <circle cx="40" cy="40" r="29" fill="none" stroke="hsl(var(--parchment))" strokeWidth="0.5" />
          </svg>

          {/* Monogram */}
          <span
            className="font-script text-xl sm:text-2xl text-parchment select-none relative z-10"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            A &amp; B
          </span>

          {/* Divider */}
          <div className="relative z-10 w-8 h-px opacity-40" style={{ background: "hsl(var(--parchment))" }} />

          {/* Year */}
          <span
            className="text-[7px] tracking-[0.3em] uppercase font-serif relative z-10 opacity-60 select-none"
            style={{ color: "hsl(var(--parchment))" }}
          >
            2026
          </span>
        </div>
      </div>

      {/* Wax drips */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-3 rounded-b-full"
        style={{ background: "hsl(var(--seal))" }}
      />
      <div
        className="absolute -bottom-0.5 left-[32%] w-3 h-2 rounded-b-full"
        style={{ background: "hsl(var(--seal))" }}
      />
    </motion.div>
  );
};
