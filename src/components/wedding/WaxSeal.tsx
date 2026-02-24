import { motion } from "framer-motion";

export const WaxSeal = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto"
    >
      {/* Gold shimmer outer ring */}
      <div
        className="w-full h-full rounded-full gold-shimmer flex items-center justify-center"
        style={{
          boxShadow:
            "0 6px 36px hsl(var(--gold) / 0.45), inset 0 1px 3px hsl(var(--gold-light) / 0.6), 0 2px 8px hsl(var(--gold) / 0.2)",
        }}
      >
        {/* Inner wax body */}
        <div
          className="relative w-[84%] h-[84%] rounded-full flex flex-col items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 30% 28%, hsl(var(--seal-light)) 0%, hsl(var(--seal)) 55%, hsl(0 40% 22%) 100%)",
            boxShadow: "inset 0 3px 14px rgba(0,0,0,0.45), inset 0 -1px 4px rgba(255,255,255,0.06)",
          }}
        >
          {/* Elaborate seal engraving SVG */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
            {/* Outer dashed ring */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--parchment))" strokeWidth="0.65" strokeDasharray="2.2 3.2" opacity="0.28"/>
            {/* Inner solid ring */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(var(--parchment))" strokeWidth="0.5" opacity="0.18"/>

            {/* Cardinal diamonds — top, bottom, left, right */}
            <polygon points="50,6 52.2,10 50,14 47.8,10" fill="hsl(var(--parchment))" opacity="0.45"/>
            <polygon points="50,86 52.2,90 50,94 47.8,90" fill="hsl(var(--parchment))" opacity="0.45"/>
            <polygon points="6,50 10,47.8 14,50 10,52.2" fill="hsl(var(--parchment))" opacity="0.3"/>
            <polygon points="86,50 90,47.8 94,50 90,52.2" fill="hsl(var(--parchment))" opacity="0.3"/>

            {/* Diagonal small dots */}
            <circle cx="22" cy="22" r="0.9" fill="hsl(var(--parchment))" opacity="0.2"/>
            <circle cx="78" cy="22" r="0.9" fill="hsl(var(--parchment))" opacity="0.2"/>
            <circle cx="22" cy="78" r="0.9" fill="hsl(var(--parchment))" opacity="0.2"/>
            <circle cx="78" cy="78" r="0.9" fill="hsl(var(--parchment))" opacity="0.2"/>

            {/* Thin horizontal arms flanking the year */}
            <line x1="18" y1="65" x2="35" y2="65" stroke="hsl(var(--parchment))" strokeWidth="0.5" opacity="0.28"/>
            <line x1="65" y1="65" x2="82" y2="65" stroke="hsl(var(--parchment))" strokeWidth="0.5" opacity="0.28"/>

            {/* Center diamond between A and B */}
            <polygon points="50,46 52,50 50,54 48,50" fill="hsl(var(--parchment))" opacity="0.38"/>

            {/* Thin top arch dots */}
            {[0,1,2,3,4].map(i => {
              const angle = -70 + i * 35;
              const rad = (angle * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={50 + 41 * Math.cos(rad)}
                  cy={50 + 41 * Math.sin(rad)}
                  r="0.7"
                  fill="hsl(var(--parchment))"
                  opacity="0.18"
                />
              );
            })}
          </svg>

          {/* Monogram — A and B flanking a divider */}
          <div className="relative z-10 flex items-center" style={{ gap: "6px", marginTop: "-6px" }}>
            <span
              className="font-script select-none"
              style={{
                fontSize: "2.1rem",
                lineHeight: 1,
                color: "hsl(var(--parchment))",
                textShadow: "0 1px 8px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.4)",
              }}
            >
              A
            </span>
            {/* Thin vertical rule */}
            <div
              className="flex flex-col items-center"
              style={{ gap: "2px" }}
            >
              <div style={{ width: "0.5px", height: "8px", background: "hsl(var(--parchment) / 0.35)" }} />
              <div style={{ width: "3px", height: "3px", background: "hsl(var(--parchment) / 0.45)", transform: "rotate(45deg)" }} />
              <div style={{ width: "0.5px", height: "8px", background: "hsl(var(--parchment) / 0.35)" }} />
            </div>
            <span
              className="font-script select-none"
              style={{
                fontSize: "2.1rem",
                lineHeight: 1,
                color: "hsl(var(--parchment))",
                textShadow: "0 1px 8px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.4)",
              }}
            >
              B
            </span>
          </div>

          {/* Year */}
          <span
            className="font-serif select-none relative z-10"
            style={{
              fontSize: "6.5px",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "hsl(var(--parchment))",
              opacity: 0.5,
              marginTop: "5px",
            }}
          >
            2026
          </span>
        </div>
      </div>

      {/* Wax drips — three for realism */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 rounded-b-full"
        style={{ background: "hsl(var(--seal))" }}
      />
      <div
        className="absolute -bottom-1.5 left-[28%] w-4 h-3 rounded-b-full"
        style={{ background: "hsl(var(--seal))" }}
      />
      <div
        className="absolute -bottom-1 left-[64%] w-3 h-2 rounded-b-full"
        style={{ background: "hsl(0 35% 26%)" }}
      />
    </motion.div>
  );
};
