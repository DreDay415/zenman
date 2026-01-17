"use client";

import { RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type OverlayProps = {
  targetRef: RefObject<HTMLElement>;
};

const fadeRange = (start: number, mid: number, end: number) => ({
  input: [start, mid, end],
  output: [0, 1, 0],
});

export default function Overlay({ targetRef }: OverlayProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const sectionOne = fadeRange(0.0, 0.08, 0.2);
  const sectionTwo = fadeRange(0.28, 0.4, 0.52);
  const sectionThree = fadeRange(0.58, 0.72, 0.84);

  const yOne = useTransform(scrollYProgress, [0, 0.2], [0, -40]);
  const yTwo = useTransform(scrollYProgress, [0.25, 0.55], [30, -30]);
  const yThree = useTransform(scrollYProgress, [0.55, 0.9], [40, -40]);

  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
        style={{
          opacity: useTransform(scrollYProgress, sectionOne.input, sectionOne.output),
          y: yOne,
        }}
      >
        <h1 className="text-5xl font-semibold tracking-tight text-white drop-shadow-sm md:text-7xl">
          Breath.
        </h1>
      </motion.div>

      <motion.div
        className="absolute left-10 top-1/2 w-full max-w-md -translate-y-1/2 text-left md:left-20"
        style={{
          opacity: useTransform(scrollYProgress, sectionTwo.input, sectionTwo.output),
          y: yTwo,
        }}
      >
        <h2 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm md:text-6xl">
          Light.
        </h2>
      </motion.div>

      <motion.div
        className="absolute right-8 top-1/2 w-full max-w-xl -translate-y-1/2 text-right md:right-24"
        style={{
          opacity: useTransform(
            scrollYProgress,
            sectionThree.input,
            sectionThree.output,
          ),
          y: yThree,
        }}
      >
        <h3 className="text-2xl font-medium tracking-tight text-white/90 drop-shadow-sm md:text-4xl">
          Bridging design and engineering.
        </h3>
      </motion.div>
    </div>
  );
}
