import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export const ExperienceMotion = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.2 });

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[3px] z-[90] origin-left"
        style={{
          scaleX: progress,
          background: "linear-gradient(90deg, hsl(var(--accent) / 0.6), hsl(var(--gold-light)), hsl(var(--accent) / 0.7))",
        }}
      />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "hsl(var(--accent) / 0.11)" }}
          animate={
            prefersReducedMotion
              ? undefined
              : { x: [0, 22, -14, 0], y: [0, 14, 28, 0], scale: [1, 1.08, 0.98, 1] }
          }
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[35%] -right-16 w-56 h-56 rounded-full blur-3xl"
          style={{ background: "hsl(var(--olive) / 0.1)" }}
          animate={
            prefersReducedMotion
              ? undefined
              : { x: [0, -30, -10, 0], y: [0, -18, 22, 0], scale: [1, 0.95, 1.05, 1] }
          }
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </>
  );
};
