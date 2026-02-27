import { motion } from "framer-motion";

export const WaxSeal = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto"
    >
      <div
        className="w-full h-full rounded-full overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 38% 32%, hsl(350 22% 58%) 0%, hsl(var(--seal)) 55%, hsl(350 28% 36%) 100%)",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.14)",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* A — large, top-left anchor */}
          <text
            x="3"
            y="73"
            fontSize="75"
            fontFamily="'Cormorant Garamond', 'Libre Baskerville', Georgia, serif"
            fontWeight="600"
            fill="white"
            fillOpacity="0.93"
          >
            A
          </text>

          {/* & — italic, nestled at center */}
          <text
            x="26"
            y="90"
            fontSize="50"
            fontFamily="'Cormorant Garamond', 'Libre Baskerville', Georgia, serif"
            fontStyle="italic"
            fontWeight="400"
            fill="white"
            fillOpacity="0.86"
          >
            &amp;
          </text>

          {/* B — large, lower-right */}
          <text
            x="48"
            y="80"
            fontSize="72"
            fontFamily="'Cormorant Garamond', 'Libre Baskerville', Georgia, serif"
            fontWeight="600"
            fill="white"
            fillOpacity="0.93"
          >
            B
          </text>
        </svg>
      </div>
    </motion.div>
  );
};
