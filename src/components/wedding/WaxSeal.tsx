import { motion } from "framer-motion";

export const WaxSeal = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto"
    >
      {/* Seal body */}
      <div
        className="w-full h-full rounded-full flex items-center justify-center gold-shimmer"
        style={{
          boxShadow:
            "0 4px 20px hsl(var(--gold) / 0.3), inset 0 1px 2px hsl(var(--gold-light) / 0.5)",
        }}
      >
        <div
          className="w-[85%] h-[85%] rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 35%, hsl(var(--seal-light)), hsl(var(--seal)))`,
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.1)",
          }}
        >
          <span className="font-script text-2xl sm:text-3xl text-parchment select-none" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            A & B
          </span>
        </div>
      </div>

      {/* Wax drips */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-3 rounded-b-full"
        style={{ background: "hsl(var(--seal))" }}
      />
      <div
        className="absolute -bottom-0.5 left-[30%] w-3 h-2 rounded-b-full"
        style={{ background: "hsl(var(--seal))" }}
      />
    </motion.div>
  );
};
